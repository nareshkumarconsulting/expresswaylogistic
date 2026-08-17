// Paste this into the "AI Classify & Extract" Code node in n8n.
// Provider priority: Groq (free) → Gemini (free) → OpenAI
// Groq: llama-3.3-70b-versatile was shut down 16 Aug 2026 → use openai/gpt-oss-20b

const SYSTEM_PROMPT =
  'You are an email intelligence assistant for ExpressWay Logistics. Classify into ONE category: shipment, quotation, alert, or general. Return JSON: { category, confidence, summary, urgency, extractedData }. urgency MUST be exactly one of: low, medium, high, critical (never "normal"). Shipment fields: awb, trackingNo, pickup, destination, status, eta. Quotation: quoteNo, origin, destination, carrier, price, validity. Alert: alertType, urgency, requiredAction, deadline. General: sender, subject, date, summary.';

const groqKey = $env.GROQ_API_KEY;
const geminiKey = $env.GEMINI_API_KEY;
const openaiKey = $env.OPENAI_API_KEY;
const http = this.helpers.httpRequest.bind(this.helpers);

async function classifyOne(email) {
  const userContent = [
    `From: ${email.senderName || ''} <${email.senderEmail}>`,
    `Subject: ${email.subject}`,
    `Date: ${email.receivedAt}`,
    '',
    email.body || '',
  ].join('\n');

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];

  let response;
  let provider = 'unknown';
  let lastError;

  if (groqKey) {
    try {
      provider = 'groq';
      response = await http({
        method: 'POST',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          model: 'openai/gpt-oss-20b',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages,
        },
        json: true,
      });
    } catch (error) {
      lastError = error;
      response = null;
    }
  }

  if (!response && geminiKey) {
    provider = 'gemini';
    const geminiRes = await http({
      method: 'POST',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${userContent}` }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      },
      json: true,
    });
    response = {
      choices: [
        {
          message: {
            content: geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || '',
          },
        },
      ],
    };
  }

  if (!response && openaiKey) {
    provider = 'openai';
    response = await http({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages,
      },
      json: true,
    });
  }

  if (!response) {
    throw lastError || new Error(
      'No AI key found. Add GROQ_API_KEY (free — console.groq.com) or GEMINI_API_KEY (free — aistudio.google.com) to n8n env and restart n8n.',
    );
  }

  const content = response.choices?.[0]?.message?.content || '';
  const cleaned = content.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      category: 'general',
      confidence: 0.4,
      summary: 'Parse failed',
      urgency: 'low',
      extractedData: {},
    };
  }

  const allowedUrgency = ['low', 'medium', 'high', 'critical'];
  const rawUrgency = String(parsed.urgency || '').toLowerCase();
  if (rawUrgency === 'normal' || rawUrgency === 'moderate' || rawUrgency === 'info') {
    parsed.urgency = 'medium';
  } else if (rawUrgency === 'urgent' || rawUrgency === 'important') {
    parsed.urgency = 'high';
  } else if (!allowedUrgency.includes(rawUrgency)) {
    parsed.urgency = 'low';
  } else {
    parsed.urgency = rawUrgency;
  }

  const allowedCategory = ['shipment', 'quotation', 'alert', 'general'];
  if (!allowedCategory.includes(parsed.category)) {
    parsed.category = 'general';
  }

  parsed._aiProvider = provider;
  return parsed;
}

const out = [];
for (const item of $input.all()) {
  out.push({ json: await classifyOne(item.json) });
}
return out;

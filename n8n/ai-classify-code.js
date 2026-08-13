// Paste this into the "AI Classify & Extract" Code node in n8n.
// Provider priority: Groq (free) → Gemini (free) → OpenAI

const SYSTEM_PROMPT =
  'You are an email intelligence assistant for ExpressWay Logistics. Classify into ONE category: shipment, quotation, alert, or general. Return JSON: { category, confidence, summary, urgency, extractedData }. Shipment fields: awb, trackingNo, pickup, destination, status, eta. Quotation: quoteNo, origin, destination, carrier, price, validity. Alert: alertType, urgency, requiredAction, deadline. General: sender, subject, date, summary.';

const email = $input.first().json;

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

const groqKey = $env.GROQ_API_KEY;
const geminiKey = $env.GEMINI_API_KEY;
const openaiKey = $env.OPENAI_API_KEY;

let response;
let provider = 'unknown';

if (groqKey) {
  provider = 'groq';
  response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages,
    },
    json: true,
  });
} else if (geminiKey) {
  provider = 'gemini';
  const geminiRes = await this.helpers.httpRequest({
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
} else if (openaiKey) {
  provider = 'openai';
  response = await this.helpers.httpRequest({
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
} else {
  throw new Error(
    'No AI key found. Add GROQ_API_KEY (free — console.groq.com) or GEMINI_API_KEY (free — aistudio.google.com) to .env.local and restart n8n.',
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

parsed._aiProvider = provider;

return [{ json: parsed }];

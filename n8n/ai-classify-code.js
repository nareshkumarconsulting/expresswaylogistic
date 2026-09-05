// Paste this into the "AI Classify & Extract" Code node in n8n.
// Provider priority: Groq (free) → Gemini (free) → OpenAI
// Groq: llama-3.3-70b-versatile was shut down 16 Aug 2026 → use openai/gpt-oss-20b
// Groq free gpt-oss-20b: 30 RPM but only 8K tokens/min — burst of 30 emails → 429.
// This node throttles, retries 429, and falls back so one rate-limit does not kill the batch.

const SYSTEM_PROMPT =
  'You are an email intelligence assistant for ExpressWay Logistics. Classify into ONE category: shipment, quotation, alert, or general. Return JSON: { category, confidence, summary, urgency, extractedData }. confidence MUST be a number 0.0-1.0 (never "high"/"low"). urgency MUST be exactly one of: low, medium, high, critical (never "normal"). Shipment fields: awb, trackingNo, pickup, destination, status, eta. Quotation: quoteNo, origin, destination, carrier, price, validity. Alert: alertType, urgency, requiredAction, deadline. General: sender, subject, date, summary.';

const groqKey = $env.GROQ_API_KEY;
const geminiKey = $env.GEMINI_API_KEY;
const openaiKey = $env.OPENAI_API_KEY;
const http = this.helpers.httpRequest.bind(this.helpers);

const BODY_CHARS = 2000;
const GAP_MS = 4000;
const MAX_429_WAIT_MS = 45000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorText(error) {
  const parts = [
    error?.message,
    error?.statusCode,
    error?.status,
    typeof error?.response === 'string' ? error.response : '',
    error?.response?.status,
    error?.response?.body,
    error?.error?.message,
    error?.cause?.message,
  ];
  try {
    parts.push(JSON.stringify(error));
  } catch {
    /* ignore */
  }
  return parts.filter(Boolean).join(' ');
}

function is429(error) {
  const text = errorText(error);
  return (
    error?.statusCode === 429 ||
    error?.status === 429 ||
    error?.response?.status === 429 ||
    /\b429\b/.test(text) ||
    /too many requests|rate limit/i.test(text)
  );
}

function waitMsFrom429(error) {
  const text = errorText(error);
  const minSec = text.match(/try again in (\d+)m\s*([\d.]+)?s/i);
  if (minSec) {
    const ms = (Number(minSec[1]) * 60 + Number(minSec[2] || 0)) * 1000 + 500;
    return Math.min(ms, MAX_429_WAIT_MS);
  }
  const sec = text.match(/try again in ([\d.]+)\s*s/i);
  if (sec) return Math.min(Number(sec[1]) * 1000 + 500, MAX_429_WAIT_MS);
  return 20000;
}

async function httpRetry(opts, retries = 4) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await http(opts);
    } catch (error) {
      lastError = error;
      if (!is429(error) || attempt === retries - 1) throw error;
      await sleep(waitMsFrom429(error));
    }
  }
  throw lastError;
}

function fallbackClassify(email) {
  const text = `${email.subject || ''} ${email.body || ''}`.toLowerCase();
  let category = 'general';
  if (/\b(awb|bl\b|bill of lading|container|eta|tracking|shipment|boe)\b/.test(text)) {
    category = 'shipment';
  } else if (/\b(quot(e|ation)|rate request|freight rate|offer)\b/.test(text)) {
    category = 'quotation';
  } else if (/\b(urgent|hold|delay|deadline|payment due|alert)\b/.test(text)) {
    category = 'alert';
  }
  return {
    category,
    confidence: 0.35,
    summary: String(email.subject || 'Email received').slice(0, 180),
    urgency: category === 'alert' ? 'high' : 'low',
    extractedData: {},
    _aiProvider: 'fallback',
  };
}

function normalizeParsed(parsed, provider) {
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

  const confidenceLabels = { low: 0.4, medium: 0.6, moderate: 0.6, high: 0.85, critical: 0.95 };
  const rawConf = parsed.confidence;
  if (typeof rawConf === 'number' && Number.isFinite(rawConf)) {
    parsed.confidence = rawConf > 1 ? Math.min(1, rawConf / 100) : Math.min(1, Math.max(0, rawConf));
  } else {
    const label = String(rawConf ?? '').toLowerCase().trim();
    if (confidenceLabels[label] != null) {
      parsed.confidence = confidenceLabels[label];
    } else {
      const n = parseFloat(label);
      parsed.confidence = Number.isFinite(n)
        ? (n > 1 ? Math.min(1, n / 100) : Math.min(1, Math.max(0, n)))
        : 0.5;
    }
  }

  if (parsed.extractedData && typeof parsed.extractedData === 'object') {
    for (const key of Object.keys(parsed.extractedData)) {
      if (parsed.extractedData[key] == null) delete parsed.extractedData[key];
    }
  } else {
    parsed.extractedData = {};
  }

  parsed._aiProvider = provider;
  return parsed;
}

async function classifyOne(email) {
  const userContent = [
    `From: ${email.senderName || ''} <${email.senderEmail}>`,
    `Subject: ${email.subject}`,
    `Date: ${email.receivedAt}`,
    '',
    String(email.body || '').slice(0, BODY_CHARS),
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
      response = await httpRetry({
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
    try {
      provider = 'gemini';
      const geminiRes = await httpRetry({
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
    } catch (error) {
      lastError = error;
      response = null;
    }
  }

  if (!response && openaiKey) {
    try {
      provider = 'openai';
      response = await httpRetry({
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
    } catch (error) {
      lastError = error;
      response = null;
    }
  }

  if (!response) {
    const fallback = fallbackClassify(email);
    fallback._aiError = lastError ? String(lastError.message || lastError).slice(0, 180) : 'no-ai-key';
    return fallback;
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

  return normalizeParsed(parsed, provider);
}

const items = $input.all();
const out = [];
for (let i = 0; i < items.length; i++) {
  if (i > 0) await sleep(GAP_MS);
  try {
    out.push({ json: await classifyOne(items[i].json) });
  } catch (error) {
    const fallback = fallbackClassify(items[i].json || {});
    fallback._aiError = String(error.message || error).slice(0, 180);
    out.push({ json: fallback });
  }
}
return out;

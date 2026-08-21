// Paste into the "Prepare Email Context" Code node in n8n.
// Handles IMAP Email Trigger + Gmail Trigger (Simplify on/off).
//
// Gmail Trigger: turn Options → Simplify OFF so the full body is included.
// With Simplify ON you only get From/Subject headers (no body).

function pickSubject(item) {
  return (
    item.subject ||
    item.Subject ||
    item.headers?.subject ||
    item.headers?.Subject ||
    '(no subject)'
  );
}

function pickFrom(item) {
  let senderEmail = '';
  let senderName = '';

  // mailparser / Gmail Simplify OFF: { value: [{ address, name }], text }
  if (item.from?.value?.[0]) {
    senderEmail = item.from.value[0].address || '';
    senderName = item.from.value[0].name || '';
  } else if (typeof item.from?.text === 'string') {
    const match = item.from.text.match(/^(.*?)\s*<([^>]+)>/);
    if (match) {
      senderName = match[1].trim().replace(/^"|"$/g, '');
      senderEmail = match[2];
    } else {
      senderEmail = item.from.text;
    }
  } else if (typeof item.from === 'string' && item.from) {
    const match = item.from.match(/^(.*?)\s*<([^>]+)>/);
    if (match) {
      senderName = match[1].trim().replace(/^"|"$/g, '');
      senderEmail = match[2];
    } else {
      senderEmail = item.from;
    }
  } else if (typeof item.From === 'string' && item.From) {
    // Gmail Simplify ON: capitalised header fields
    const match = item.From.match(/^(.*?)\s*<([^>]+)>/);
    if (match) {
      senderName = match[1].trim().replace(/^"|"$/g, '');
      senderEmail = match[2];
    } else {
      senderEmail = item.From;
    }
  }

  return {
    senderEmail: senderEmail || 'unknown@unknown.com',
    senderName,
  };
}

function pickBody(item) {
  const raw =
    item.textPlain ||
    item.text ||
    item.textAsHtml ||
    item.html ||
    item.snippet ||
    '';
  return String(raw).slice(0, 12000);
}

function pickMessageId(item, sourceAccount) {
  return (
    item.messageId ||
    item.message_id ||
    item.id ||
    item.uid ||
    item.headers?.['message-id'] ||
    item.headers?.['Message-ID'] ||
    `${sourceAccount}-${Date.now()}-${item.uid || Math.random().toString(36).slice(2)}`
  );
}

function pickReceivedAt(item) {
  const raw = item.date || item.internalDate || item.headers?.date || Date.now();
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

return $input.all().map(({ json: item }) => {
  const sourceAccount = item.sourceAccount;
  const { senderEmail, senderName } = pickFrom(item);
  const attachments = item.attachments || [];
  const attachmentNames = attachments
    .map((a) => a.filename || a.name)
    .filter(Boolean);

  return {
    json: {
      sourceAccount,
      externalMessageId: pickMessageId(item, sourceAccount),
      senderEmail,
      senderName,
      subject: pickSubject(item),
      receivedAt: pickReceivedAt(item),
      body: pickBody(item),
      hasAttachments: attachmentNames.length > 0,
      attachmentNames,
    },
  };
});

const N8N_WEBHOOK_URL = 'https://n8n.srv1271485.hstgr.cloud/webhook/get-email';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Webhook error' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(502).json({ error: 'Service temporarily unavailable' });
  }
}

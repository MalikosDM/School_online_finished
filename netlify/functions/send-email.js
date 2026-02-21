const N8N_WEBHOOK_URL = 'https://n8n.srv1271485.hstgr.cloud/webhook/get-email';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? event.body : JSON.stringify(event.body || {});
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: res.ok ? JSON.stringify({ ok: true }) : await res.text(),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Service temporarily unavailable' }),
    };
  }
};

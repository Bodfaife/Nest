const crypto = require('crypto');
const fetch = global.fetch || require('node-fetch');

const API = process.env.API_BASE || 'http://localhost:3333/api';
const SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'dev-webhook-secret';

async function send() {
  const body = {
    type: 'payment.succeeded',
    userId: process.env.TEST_USER_ID || '1',
    amount: process.env.TEST_AMOUNT || 1000,
    reference: `smoke-${Date.now()}`,
    idempotencyKey: `smoke-${Date.now()}`,
  };

  const payload = JSON.stringify(body);
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

  const res = await fetch(`${API}/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gateway-signature': signature,
    },
    body: payload,
  });

  const text = await res.text();
  console.log('status', res.status);
  console.log(text);
}

send().catch((e) => { console.error(e); process.exit(1); });

const crypto = require('crypto');
const fetch = global.fetch || require('node-fetch');

const API = process.env.API_BASE || 'http://localhost:3333/api';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo_secret';

async function send() {
  const event = {
    id: `evt_${Date.now()}`,
    object: 'event',
    api_version: '2022-11-15',
    created: Math.floor(Date.now() / 1000),
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: `pi_${Date.now()}`,
        object: 'payment_intent',
        amount: Number(process.env.TEST_AMOUNT || 1000),
        currency: process.env.TEST_CURRENCY || 'usd',
        metadata: {
          userId: process.env.TEST_USER_ID || '1',
          reference: `stripe-smoke-${Date.now()}`,
        }
      }
    }
  };

  const payload = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const signed = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET).update(`${t}.${payload}`).digest('hex');
  const sig = `t=${t},v1=${signed}`;

  const res = await fetch(`${API}/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': sig,
    },
    body: payload,
  });

  console.log('status', res.status);
  console.log(await res.text());
}

send().catch(e => { console.error(e); process.exit(1); });

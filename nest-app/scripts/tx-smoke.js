const base = 'http://localhost:3333/api';
const fetch = globalThis.fetch || require('node-fetch');

async function run() {
  try {
    const unique = Date.now();
    const email = `acct+${unique}@example.com`;
    console.log('register', email);
    await fetch(base + '/auth/register', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fullName: 'Tx User', email, password: 'Password123' }),
    });

    const login = await fetch(base + '/auth/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: email, password: 'Password123' }),
    });
    const loginBody = await login.json();
    const token = loginBody.accessToken;
    console.log('got token:', !!token);

    const deposit = await fetch(base + '/transactions/create', {
      method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'deposit', amount: 150.5, reference: `smoke-${unique}` }),
    });
    console.log('deposit status', deposit.status);
    console.log(await deposit.text());
  } catch (e) {
    console.error('tx smoke error', e);
  }
}

run();

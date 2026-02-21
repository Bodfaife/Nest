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

    // deposit first
    const depositRef = `smoke-dep-${unique}`;
    const deposit = await fetch(base + '/transactions/create', {
      method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'deposit', amount: 200, reference: depositRef }),
    });
    console.log('deposit status', deposit.status);
    console.log(await deposit.text());

    // withdraw
    const withdrawRef = `smoke-wd-${unique}`;
    const withdraw = await fetch(base + '/transactions/create', {
      method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'withdraw', amount: 75.25, reference: withdrawRef }),
    });
    console.log('withdraw status', withdraw.status);
    console.log(await withdraw.text());
  } catch (e) {
    console.error('tx withdraw error', e);
  }
}

run();

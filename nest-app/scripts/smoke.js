const base = 'http://localhost:3333/api';
const fetch = globalThis.fetch || require('node-fetch');

async function run() {
  try {
    console.log('POST /auth/register');
    const unique = Date.now();
    const testEmail = `test+${unique}@example.com`;
    const reg = await fetch(base + '/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fullName: 'Test User', email: testEmail, password: 'Password123' }),
    });
    console.log('register status', reg.status);
    console.log(await reg.text());

    console.log('POST /auth/login');
    const login = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: testEmail, password: 'Password123' }),
    });
    console.log('login status', login.status);
    const lc = login.headers.get('set-cookie') || login.headers.get('Set-Cookie');
    console.log('set-cookie header:', lc);
    const body = await login.text();
    console.log('login body:', body);

    if (!lc) {
      console.log('No refresh cookie set; aborting refresh test');
      return;
    }

    console.log('POST /auth/refresh with cookie');
    const refresh = await fetch(base + '/auth/refresh', {
      method: 'POST',
      headers: { Cookie: lc },
    });
    console.log('refresh status', refresh.status);
    console.log(await refresh.text());
  } catch (e) {
    console.error('Smoke test error:', e);
    process.exit(2);
  }
}

run();

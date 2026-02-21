const { Client } = require('pg');

async function ensure() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'nest_user',
    password: process.env.DB_PASSWORD || 'supersecurepassword',
    database: process.env.DB_NAME || 'nestdb',
  });

  try {
    await client.connect();
    console.log('Connected to Postgres — ensuring uuid-ossp extension');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('Extension uuid-ossp is present');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to ensure uuid-ossp extension:', err.message || err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

ensure();

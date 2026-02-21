# Nest backend (development & production migration guide)

This folder contains the NestJS backend used by the frontend. It supports a local SQLite fallback for quick development and Postgres for production.

Quick dev (SQLite):

1. Start dev server (uses SQLite by default when `DB_USE_SQLITE=true`):

```bash
cd nest-app
JWT_ACCESS_TOKEN_SECRET=devaccess JWT_REFRESH_TOKEN_SECRET=devrefresh DB_USE_SQLITE=true npm run dev
```

Postgres (Docker) — run migrations (recommended for production-like testing):

1. Start Postgres + app with Docker Compose:

```bash
cd nest-app
# optionally set DB_USER/DB_PASSWORD/DB_NAME env vars
docker-compose up -d
```

2. Ensure the `uuid-ossp` extension exists (required by migrations):

```bash
cd nest-app
npm run db:init
```

3. Run TypeORM migrations:

```bash
npm run migration:run
```

Notes & production recommendations:
- Do not use `synchronize: true` in production — rely on migrations only.
- Create the `uuid-ossp` extension in your Postgres DB prior to migrations (the `db:init` script does this if the DB is reachable).
- Manage secrets with an external secret manager (Vault, cloud KMS, or environment variables injected securely).
- Use TLS in production and set appropriate CORS origins and cookie `secure` flags.
- For payment/ledger flows: add idempotency keys, use a job queue for settlement, and verify webhooks from payment providers.

If you want, I can:
- Run the `db:init` + `migration:run` steps here (requires Docker/Postgres running). I attempted earlier and Docker isn't available in this environment.
- Add a small worker skeleton and idempotency storage for transactions.
# Nest App – Database & Migrations

Quick notes for running the backend and database migrations.

Development (fast, no Postgres required)
- The app defaults to an SQLite file when `DB_USE_SQLITE=true` or `DB_HOST` is not set.
- To run the dev server with SQLite:

```bash
cd nest-app
DB_USE_SQLITE=true JWT_ACCESS_TOKEN_SECRET=devaccess JWT_REFRESH_TOKEN_SECRET=devrefresh npm run dev
```

- SQLite path: `data/nest_dev.sqlite` (created automatically).

Migrations & Production (Postgres)
- Migrations in `migrations/` are written for Postgres (they use `uuid_generate_v4()`).
- Before running migrations on Postgres you MUST enable the `uuid-ossp` extension.

Example (with `psql` against your Postgres instance):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Using Docker Compose (recommended for local production-like setup)
1. Ensure `docker` is installed and running.
2. From `nest-app/` start Postgres:

```bash
docker-compose up -d db
# wait for Postgres to be ready (check logs)
```

3. Create the extension (run inside the container):

```bash
docker-compose exec db psql -U ${DB_USER:-nest_user} -d ${DB_NAME:-nestdb} -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
```

4. Run the migrations from the host (set DB_HOST to the db service name if using compose):

```bash
DB_HOST=127.0.0.1 DB_PORT=5432 DB_USER=nest_user DB_PASSWORD=supersecurepassword DB_NAME=nestdb npm run migration:run
```

Notes
- The app uses `synchronize: true` for the SQLite/dev path (fast local dev). For production, set `TYPEORM_SYNCHRONIZE=false` and run migrations instead.
- If you cannot run Docker here, you can still use SQLite for development. Production migration and Postgres setup require a running Postgres instance and `psql` or Docker.

If you want, I can try to run the migration commands here — but Docker/`psql` must be available on this machine.
# Nest backend (minimal)

This directory contains a minimal NestJS starter to integrate with the frontend during development.

Setup:

```bash
cd frontend/nest-app
npm install
npm run dev
```

Endpoints:
- `GET /health` — basic health check
- `POST /auth/login` — simple stubbed login (returns a dev token)

Docker (recommended for local development):

```bash
cd frontend/nest-app
cp .env.example .env
docker-compose up --build
```

Migrations (TypeORM):

```bash
# generate (after editing entities)
npm run migration:generate -- -n MigrationName
npm run migration:run
```

Replace or extend these files as needed for production-ready auth, validation, and persistence.

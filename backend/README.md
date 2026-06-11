Backend (Node.js + TypeScript)

Run locally:

```bash
cd backend
npm install
npm run dev
```

API endpoints are proxied by the frontend dev server in the recommended setup.

Postgres (optional):

You can run Postgres with Docker Compose from the workspace root:

```bash
docker compose up -d
```

Set `DATABASE_URL` and `JWT_SECRET` as environment variables before starting the backend, for example:

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/carpool
export JWT_SECRET=your_secret_here
npm run dev
```


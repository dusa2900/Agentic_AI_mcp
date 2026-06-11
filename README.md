# Carpooling App (MVP with Auth & Postgres)

This workspace contains a minimal scaffold for the Carpooling application:
- Frontend: `frontend` — React + Vite + TypeScript with JWT authentication
- Backend: `backend` — Node.js + Express + TypeScript + Postgres

## Quick Start

### Option 1: With Docker (Recommended)

**1. Install Docker Desktop (if not already installed):**
- Download from https://www.docker.com/products/docker-desktop/
- Install and restart your computer if needed
- Make sure Docker Desktop is running before proceeding

**2. Start Postgres with Docker Compose:**

```bash
docker compose up -d
```

**3. Start backend:**

```bash
cd backend
npm install
npm run dev
```

**4. Start frontend (in another terminal):**

```bash
cd frontend
npm install
npm run dev
```

**5. Open browser:** http://localhost:5173

### Option 2: Without Docker (Use Cloud/Local Postgres)

**1. Get a Postgres database:**

Choose one of these options:

**A) Install Postgres locally on Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install and note your username/password (default: postgres/postgres)
- Create database: `createdb carpool`

**B) Use a free cloud Postgres service:**
- [Neon](https://neon.tech) (free tier, instant setup) - **See [NEON_SETUP.md](NEON_SETUP.md) for detailed guide**
- [Supabase](https://supabase.com) (free tier)
- [ElephantSQL](https://www.elephantsql.com) (free tier)

**2. Set DATABASE_URL environment variable:**

**Option A: Using .env file (recommended):**

Create a `.env` file in the `backend` folder (copy from `.env.example`):
```
DATABASE_URL=postgres://username:password@host:port/database
JWT_SECRET=your-secret-key-here
```

**Option B: Set in terminal session:**

Windows PowerShell:
```powershell
$env:DATABASE_URL="postgres://username:password@host:5432/carpool"
```

Windows CMD:
```cmd
set DATABASE_URL=postgres://username:password@host:5432/carpool
```

**3. Test database connection:**

```bash
cd backend
node test-db.js
```

You should see: ✅ Database connection successful!

**4. Start backend:**

```bash
cd backend
npm install
npm run dev
```

**4. Start frontend (new terminal):**

```bash
cd frontend
npm install
npm run dev
```

**5. Open browser:** http://localhost:5173

## Features Implemented

- ✅ User signup/login with JWT authentication
- ✅ Publish routes (requires auth)
- ✅ View all routes
- ✅ Book seats (requires auth, prevents self-booking, enforces seat limits)
- ✅ Booking history view (shows user's past bookings)
- ✅ Comments/messaging for each route (view and post comments)
- ✅ Postgres persistence for users, routes, bookings, and comments
- ✅ Transaction-safe booking logic
- ✅ Unit tests for backend booking logic
- ✅ Component tests for frontend (Login component)

## Running Tests

**Backend tests:**
```bash
cd backend
npm test
```

**Frontend tests:**
```bash
cd frontend
npm test
```

## Troubleshooting

**"'docker' is not recognized as an internal or external command":**
- Docker is not installed → Install Docker Desktop from https://www.docker.com/products/docker-desktop/
- OR use Option 2 above (run Postgres without Docker using local installation or cloud service)

**"Server error" during login/signup:**
- Make sure Postgres is running:
  - If using Docker: `docker compose ps`
  - If using local Postgres: Check Windows Services or run `pg_isready`
  - If using cloud Postgres: Check your cloud dashboard
- If not running, start it: `docker compose up -d` (Docker) or start the service (local)
- Check backend logs for detailed error messages
- Verify DATABASE_URL is correct (default: `postgres://postgres:postgres@localhost:5432/carpool`)

**Database connection errors:**
```bash
# If using Docker:
# Check if Postgres container is running
docker compose ps

# View Postgres logs
docker compose logs db

# Restart Postgres
docker compose restart db
```

If using local/cloud Postgres, check connection string and ensure database exists.

**Port conflicts:**
- Backend runs on port 4000 (configurable with `PORT` env var)
- Frontend runs on port 5173
- Postgres runs on port 5432
- Make sure these ports are not in use by other services

## Environment Variables

Backend optionally supports:
- `DATABASE_URL` (default: `postgres://postgres:postgres@localhost:5432/carpool`)
- `JWT_SECRET` (default: `dev_secret`)
- `PORT` (default: `4000`)

## Next Steps

- Add user profile management (edit name, vehicle info)
- Add route cancellation and booking cancellation flows
- Add ratings and reviews for completed trips
- Expand test coverage (integration and E2E tests)
- Set up CI/CD pipeline with GitHub Actions
- Add payment integration (Stripe/PayPal)
- Implement realtime notifications with WebSocket
- Add admin dashboard for moderation

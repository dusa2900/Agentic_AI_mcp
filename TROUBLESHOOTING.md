# Fixing 500 Login Error

## Step 1: Test Database Connection

```bash
cd backend
node test-db.js
```

If this fails, check your DATABASE_URL in `.env`.

## Step 2: Restart Backend (with logging)

Stop your current backend (Ctrl+C) and restart:

```bash
cd backend
npm run dev
```

Watch for these log messages:
- ✅ Database initialized successfully
- 📊 Tables found: users, routes, bookings, comments

## Step 3: Create Test User

```bash
cd backend
node create-test-user.js
```

This creates:
- Email: `test@example.com`
- Password: `password123`

## Step 4: Try Login Again

1. Go to http://localhost:5173
2. Login with `test@example.com` / `password123`
3. Check the backend terminal for detailed logs:
   - 🔍 Login attempt for: test@example.com
   - 📊 Query result rows: 1
   - ✅ User found, comparing password...
   - ✅ Password match, generating token...
   - ✅ Login successful

## Common Issues

### Database not connected
- Check your DATABASE_URL in `backend/.env`
- Verify the database is accessible

### Tables don't exist
- The backend should auto-create tables on startup
- If not, check the logs for errors during initialization

### Wrong password hash
- Run `create-test-user.js` to create a fresh user with known credentials

### Still getting 500?
Check the backend terminal for the full error with stack trace.

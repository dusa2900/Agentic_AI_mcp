# Neon Setup Guide

## Step 1: Create a Neon Account & Database

1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project (it will auto-create a database)
4. Copy your connection string from the dashboard

The connection string looks like:
```
postgres://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb
```

## Step 2: Set Environment Variable in Windows PowerShell

Open PowerShell in the `backend` folder and run:

```powershell
$env:DATABASE_URL="your-neon-connection-string-here"
```

**Important:** This only sets it for the current PowerShell session. You need to set it in the same terminal where you run `npm run dev`.

## Step 3: Test Database Connection

Before starting the backend, test the connection:

```bash
node test-db.js
```

You should see: ✅ Database connection successful!

If you see an error, double-check your connection string.

## Step 4: Start Backend

In the **same PowerShell window** where you set DATABASE_URL:

```bash
npm run dev
```

You should see:
```
✅ Database initialized successfully
✅ Backend listening on http://localhost:4000
```

## Step 5: Start Frontend (New Terminal)

Open a **new** terminal for the frontend:

```bash
cd frontend
npm run dev
```

## Troubleshooting

**"server error" when logging in:**
- Check the backend terminal for detailed error messages
- Look for red ❌ symbols showing what failed
- Make sure you set DATABASE_URL in the same terminal before running `npm run dev`

**Connection string issues:**
- Make sure you copied the full string including `postgres://`
- Don't add quotes inside the quotes
- Neon strings often end with `?sslmode=require` - that's fine, keep it

**Persistent environment variable (optional):**

To avoid setting DATABASE_URL every time, create a `.env` file in the `backend` folder:

```
DATABASE_URL=your-neon-connection-string-here
JWT_SECRET=your-secret-here
```

Then install dotenv (already in package.json) and it will auto-load.

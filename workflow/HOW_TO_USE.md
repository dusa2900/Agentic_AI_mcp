# Carpooling Platform - Comprehensive User Guide

## Table of Contents
- [What is the Carpooling Platform?](#what-is-the-carpooling-platform)
- [Why Use This Platform?](#why-use-this-platform)
- [When to Use Each Feature?](#when-to-use-each-feature)
- [Where are Components Located?](#where-are-components-located)
- [Who Can Use This Platform?](#who-can-use-this-platform)
- [How to Use the Platform (User Perspective)](#how-to-use-the-platform-user-perspective)
- [How to Develop Features (Developer Perspective)](#how-to-develop-features-developer-perspective)
- [How Does It Work Internally?](#how-does-it-work-internally)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## What is the Carpooling Platform?

### Platform Overview
The Carpooling Platform is a full-stack web application that enables users to share vehicle journeys by:
- **Publishing routes** with departure and destination information
- **Booking seats** on existing routes (maximum 4 seats per vehicle)
- **Communicating** through comments and chat
- **Tracking history** of all travels as publisher or traveler

### Core Components
```
┌─────────────────────────────────────────────────────┐
│              Carpooling Platform                    │
├─────────────────────────────────────────────────────┤
│ Frontend: React + TypeScript + Vite                │
│ Backend: Node.js + Express + TypeScript             │
│ Database: PostgreSQL                                │
│ MCP Layer: GitHub integration for AI agents         │
│ Authentication: JWT-based secure auth               │
└─────────────────────────────────────────────────────┘
```

### Key Features Matrix

| Feature | Description | User Type | Status |
|---------|-------------|-----------|--------|
| **User Registration** | Create account with email/password | All | ✅ Complete |
| **User Login** | Secure JWT authentication | All | ✅ Complete |
| **Route Publishing** | Create new carpooling routes | Publishers | ✅ Complete |
| **Route Discovery** | Browse available routes | Travelers | ✅ Complete |
| **Seat Booking** | Reserve seats on routes | Travelers | ✅ Complete |
| **Comments/Chat** | Communicate with other users | All | ✅ Complete |
| **Booking Management** | View and manage bookings | Travelers | ✅ Complete |
| **Travel History** | Track publisher/traveler history | All | 🚧 In Progress |
| **User Ratings** | Rate and review users | All | 📋 Planned |
| **Payment Integration** | Pay for bookings | Travelers | 📋 Planned |

---

## Why Use This Platform?

### For Publishers (Route Owners)
✅ **Share Travel Costs**
- Split fuel and toll costs with passengers
- Make your regular commute profitable
- Reduce overall travel expenses

✅ **Environmental Impact**
- Reduce carbon footprint
- Decrease traffic congestion
- Promote sustainable transportation

✅ **Social Connection**
- Meet new people during travel
- Build a community of regular travelers
- Network with professionals

### For Travelers (Passengers)
✅ **Cost-Effective Travel**
- Cheaper than taxis or rental cars
- No vehicle maintenance costs
- Pay only for actual travel

✅ **Convenience**
- Door-to-door service
- Flexible scheduling
- Browse multiple route options

✅ **Safety**
- Verified user profiles
- Travel history and ratings
- In-app communication

### For Developers
✅ **Modern Tech Stack**
- TypeScript for type safety
- React for reactive UI
- PostgreSQL for reliable data
- MCP integration for AI features

✅ **Extensible Architecture**
- Well-defined API contracts
- Modular component structure
- Easy to add new features
- AI agent integration ready

---

## When to Use Each Feature?

### User Authentication

#### When to Register?
- ✅ First time using the platform
- ✅ Want to publish routes or book seats
- ✅ Need to access saved bookings

#### When to Login?
- ✅ After registration
- ✅ Session expired
- ✅ Using a different device
- ✅ Cleared browser cache

### Route Publishing

#### When to Publish a Route?
- ✅ Planning a trip and have empty seats
- ✅ Regular commute you want to share
- ✅ One-time long-distance journey
- ✅ At least 1 seat available for passengers

#### When NOT to Publish?
- ❌ Vehicle is full (all 4 seats occupied)
- ❌ Trip is too short (< 5km)
- ❌ Uncertain about trip timing
- ❌ Not comfortable with passengers

### Seat Booking

#### When to Book Seats?
- ✅ Found a route matching your journey
- ✅ Time and location work for you
- ✅ Seats available
- ✅ Comfortable with the publisher

#### When NOT to Book?
- ❌ It's your own published route (self-booking prevented)
- ❌ No seats available
- ❌ Time doesn't match your schedule
- ❌ Haven't communicated with publisher

### Comments/Chat

#### When to Comment?
- ✅ After booking to coordinate meeting point
- ✅ Ask questions before booking
- ✅ Update about delays or changes
- ✅ Share arrival time updates

#### When to Use Instruction Comments? (Publishers only)
- ✅ Give specific pickup instructions
- ✅ Share vehicle details
- ✅ Communicate last-minute changes
- ✅ Provide emergency contact info

---

## Where are Components Located?

### Project Structure

```
carpooling-platform/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Root component
│   │   ├── AuthContext.tsx     # Authentication state
│   │   ├── api/
│   │   │   └── axios.ts        # API client configuration
│   │   └── components/
│   │       ├── Login.tsx       # Login/Register form
│   │       ├── RouteList.tsx   # List all routes
│   │       ├── PublishRoute.tsx # Create new route
│   │       ├── MyBookings.tsx  # User's bookings
│   │       └── Comments.tsx    # Comment system
│   ├── index.html              # HTML template
│   └── package.json            # Frontend dependencies
│
├── backend/                     # Node.js backend application
│   ├── src/
│   │   ├── index.ts            # Express server entry
│   │   ├── db.ts               # PostgreSQL connection
│   │   ├── auth.ts             # Auth routes
│   │   ├── routes.service.ts   # Business logic
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT middleware
│   │   └── mcp/                # MCP integration
│   │       ├── server/         # MCP server
│   │       ├── client/         # MCP client
│   │       ├── github/         # GitHub tools
│   │       └── schemas/        # Tool schemas
│   └── package.json            # Backend dependencies
│
├── workflow/                    # Documentation (this folder)
│   ├── README.md               # Documentation index
│   ├── ARCHITECTURE.md         # System architecture
│   ├── WORKFLOWS.md            # Workflow diagrams
│   ├── HOW_TO_USE.md           # This file
│   ├── MCP_GUIDE.md            # MCP integration guide
│   ├── AGENTS_GUIDE.md         # AI agents guide
│   └── GENERATE_PDF.md         # PDF generation guide
│
└── docker-compose.yml          # PostgreSQL container
```

### File Locations Quick Reference

| What | Where | Purpose |
|------|-------|---------|
| Login UI | `/frontend/src/components/Login.tsx` | User authentication form |
| Route List | `/frontend/src/components/RouteList.tsx` | Browse routes |
| Publish Form | `/frontend/src/components/PublishRoute.tsx` | Create routes |
| API Client | `/frontend/src/api/axios.ts` | HTTP client setup |
| Auth Logic | `/backend/src/auth.ts` | Login/register endpoints |
| Business Logic | `/backend/src/routes.service.ts` | Core functionality |
| Database | `/backend/src/db.ts` | PostgreSQL connection |
| MCP Server | `/backend/src/mcp/server/index.ts` | MCP protocol implementation |
| GitHub Tools | `/backend/src/mcp/github/github.tools.ts` | GitHub operations |

---

## Who Can Use This Platform?

### User Roles

#### 1. Anonymous Visitors
**What they can do:**
- ❌ Cannot publish routes
- ❌ Cannot book seats
- ❌ Cannot comment
- ✅ Can view login/register page only

**Workflow:**
```
Anonymous → Register/Login → Authenticated User
```

#### 2. Authenticated Users (General)
**What they can do:**
- ✅ View all published routes
- ✅ Publish new routes (becomes Publisher)
- ✅ Book seats on routes (becomes Traveler)
- ✅ Comment on routes they're involved in
- ✅ View their booking history
- ✅ Logout

**User Profile:**
```typescript
{
  id: number,
  email: string,
  name: string,
  created_at: Date
}
```

#### 3. Publishers (Route Owners)
**Who they are:**
- Users who have published at least one route
- Own a vehicle with seats to share
- Responsible for the journey

**What they can do:**
- ✅ All authenticated user actions
- ✅ Publish routes with details
- ✅ View bookings on their routes
- ✅ Post instruction comments
- ✅ Cancel routes (future feature)
- ✅ Rate travelers (future feature)

**Constraints:**
- ❌ Cannot book their own routes
- ❌ Maximum 4 seats per vehicle
- ⚠️ Must maintain published schedules

#### 4. Travelers (Passengers)
**Who they are:**
- Users who have booked at least one seat
- Need transportation on specific routes
- Join existing journeys

**What they can do:**
- ✅ All authenticated user actions
- ✅ Book seats on available routes
- ✅ View booking confirmations
- ✅ Cancel bookings (future feature)
- ✅ Rate publishers (future feature)

**Constraints:**
- ❌ Cannot book own routes
- ❌ Cannot book if seats unavailable
- ⚠️ Must respect booking terms

#### 5. Administrators (Future)
**Planned capabilities:**
- Moderate content
- Handle disputes
- View analytics
- Manage users
- System configuration

---

## How to Use the Platform (User Perspective)

### Getting Started

#### Step 1: Installation & Setup

**For Local Development:**
```bash
# 1. Clone repository
git clone <repository-url>
cd carpooling-platform

# 2. Start PostgreSQL with Docker
docker compose up -d

# 3. Start Backend
cd backend
npm install
npm run dev

# 4. Start Frontend (new terminal)
cd frontend
npm install
npm run dev

# 5. Open browser
http://localhost:5173
```

**Environment Setup:**
```bash
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carpool
JWT_SECRET=your-secret-key-here
GITHUB_TOKEN=github_pat_xxxxx  # For MCP features
```

#### Step 2: Create Account

1. Open http://localhost:5173
2. Click "Register" tab
3. Fill in:
   - **Email**: your-email@example.com
   - **Name**: Your Full Name
   - **Password**: Strong password (min 6 chars)
4. Click "Register" button
5. You're automatically logged in!

**What happens behind the scenes:**
```
User Input → Frontend Validation → Backend API → 
Password Hashing → Database Insert → JWT Generation → 
Token Stored → User Logged In → Dashboard Displayed
```

#### Step 3: Login (Returning Users)

1. Enter registered email and password
2. Click "Login"
3. Dashboard appears with routes and booking options

**Session Management:**
- Token stored in `localStorage`
- Valid for 7 days
- Automatically included in API requests
- Logout clears token

---

### Publishing Routes

#### Complete Publishing Workflow

**Step 1: Access Publish Form**
- Located on the right side of dashboard
- Only available to logged-in users

**Step 2: Fill Route Details**

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **Origin** | Starting point | "Delhi, Connaught Place" | ✅ Yes |
| **Destination** | End point | "Agra, Taj Mahal" | ✅ Yes |
| **Date/Time** | Journey time | "2026-06-15T08:00" | ✅ Yes |
| **Total Seats** | Available seats (max 4) | 3 | ✅ Yes |

**Step 3: Submit**
1. Click "Publish Route"
2. Validation occurs:
   - All fields filled?
   - Seats between 1-4?
   - Valid datetime format?
3. If valid: Route created and appears in RouteList
4. If invalid: Error message shown

**Example:**
```
Origin: "Mumbai, Bandra Station"
Destination: "Pune, Shivaji Nagar"
DateTime: "2026-06-20T07:00"
Seats: 3

Result: Route published with 3 available seats
```

**After Publishing:**
- Route appears in main list
- Other users can book seats
- You can see bookings (future feature)
- Comments section available

---

### Booking Seats

#### Complete Booking Workflow

**Step 1: Browse Routes**
- Main dashboard shows all available routes
- Each route displays:
  - Origin → Destination
  - Date and time
  - Publisher name
  - Available seats
  - Book button

**Step 2: Select Route**
- Review route details carefully
- Check datetime matches your schedule
- Verify pickup/drop location
- Check publisher information

**Step 3: Book Seats**

**UI Interaction:**
```
[Route Card]
Mumbai → Pune
Date: 2026-06-20 at 07:00
Publisher: John Doe
Available Seats: 3/4

[Book Now] ← Click here
↓
Specify number of seats: [1] ← Enter quantity
↓
[Confirm Booking]
```

**Validation Checks:**
1. ✅ User is logged in
2. ✅ Not booking own route
3. ✅ Seats available >= requested seats
4. ✅ No duplicate booking

**Step 4: Confirmation**
- Booking appears in "My Bookings" section
- Route's available seats decrease
- Can communicate via comments

#### Booking Scenarios

**✅ Successful Booking:**
```
User: Alice (logged in)
Route: Published by Bob
Available Seats: 2
Requested Seats: 1

Result: Booking created
Available Seats: 2 → 1
Alice sees booking in "My Bookings"
```

**❌ Self-Booking Prevented:**
```
User: Alice
Route: Published by Alice
Action: Click "Book"

Result: Error "Cannot book your own route"
```

**❌ Insufficient Seats:**
```
Available Seats: 1
Requested Seats: 2

Result: Error "Not enough seats available"
```

---

### Using Comments/Chat

#### Comment System Overview

**Purpose:**
- Coordinate meeting points
- Ask questions before booking
- Share contact information
- Update about delays

**Types of Comments:**

1. **Regular Comments** (All users)
   - General communication
   - Questions and answers
   - Updates

2. **Instruction Comments** (Publishers only)
   - Special styling (highlighted)
   - Important notices
   - Meeting point details
   - Vehicle information

#### How to Comment

**Step 1: Navigate to Route**
- Click on a route card
- Or scroll to route with bookings

**Step 2: View Existing Comments**
- Comments appear below route details
- Sorted by timestamp (oldest first)
- Shows author name and time

**Step 3: Post Comment**
```
[Comment Box]
Type your message here...

☐ This is an instruction (Publishers only)

[Post Comment]
```

**Step 4: See Updated Thread**
- Your comment appears immediately
- Others can see it (real-time updates planned)

#### Comment Examples

**Traveler Question:**
```
User: Alice
Route: Mumbai → Pune
Comment: "Hi! Can we meet at Bandra Station east exit?"
```

**Publisher Instruction:**
```
User: Bob (Publisher)
Route: Mumbai → Pune
Comment: "Meeting at Bandra Station east exit at 7:00 AM. 
         My car is a white Swift, number MH-01-AB-1234."
Type: ✅ Instruction
```

**Update:**
```
User: Alice
Comment: "Running 5 minutes late, stuck in traffic"
```

---

### Managing Bookings

#### View Your Bookings

**Location:** "My Bookings" section on dashboard

**Information Displayed:**
```
┌─────────────────────────────────────────────┐
│ MY BOOKINGS                                 │
├─────────────────────────────────────────────┤
│ Route: Delhi → Agra                         │
│ Date: 2026-06-15 at 08:00                   │
│ Publisher: John Doe                         │
│ Seats Booked: 2                             │
│ Status: Confirmed                           │
│ Booked on: 2026-06-10                       │
├─────────────────────────────────────────────┤
│ Route: Mumbai → Pune                        │
│ Date: 2026-06-20 at 07:00                   │
│ Publisher: Jane Smith                       │
│ Seats Booked: 1                             │
│ Status: Confirmed                           │
│ Booked on: 2026-06-11                       │
└─────────────────────────────────────────────┘
```

#### Future Features

**Cancellation Flow (Planned):**
```
My Bookings → Select Booking → [Cancel] → 
Confirm Cancellation → Seats Restored → 
Cancellation Email Sent
```

**Rating System (Planned):**
```
Completed Trip → Rate Publisher (1-5 stars) → 
Add Review Text → Submit Rating → 
Updates Publisher Profile
```

---

## How to Develop Features (Developer Perspective)

### Development Setup

#### Prerequisites
```yaml
Required:
  - Node.js: v18 or higher
  - npm: v9 or higher
  - PostgreSQL: v14 or higher
  - Docker: Latest (optional, for easy DB setup)
  - Git: Latest

Recommended:
  - VS Code with extensions:
    - ESLint
    - Prettier
    - TypeScript
    - Tailwind CSS IntelliSense (if used)
```

#### Initial Setup Steps

**1. Clone and Install:**
```bash
git clone <repository-url>
cd carpooling-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**2. Database Setup:**

**Option A: Docker (Recommended):**
```bash
# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker compose ps
```

**Option B: Manual PostgreSQL:**
```bash
# Install PostgreSQL locally
# Create database
createdb carpool

# Update connection string in backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/carpool
```

**3. Environment Configuration:**

**backend/.env:**
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carpool

# JWT Secret (change this!)
JWT_SECRET=super-secret-key-change-in-production

# Server
PORT=4000
NODE_ENV=development

# MCP / GitHub (optional, for MCP features)
GITHUB_TOKEN=github_pat_xxxxx
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo
```

**frontend/.env:**
```bash
# API URL
VITE_API_URL=http://localhost:4000

# Feature flags
VITE_ENABLE_COMMENTS=true
```

**4. Initialize Database:**
```bash
cd backend
node test-db.js  # Test connection
npm run seed     # Seed data (if available)
```

**5. Start Development Servers:**

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

### Adding a New Feature

#### Feature Development Workflow

**Step 1: Requirements Analysis**
```
What: Define feature clearly
Why: Business value
Who: Target users
When: Use cases
Where: UI location
How: Technical approach
```

**Example Feature: "User Ratings"**
```yaml
What: Allow travelers to rate publishers after trips
Why: Build trust and reputation system
Who: Travelers (after trip completion)
When: After trip datetime has passed
Where: "My Bookings" → Completed trips → Rate button
How: 
  - Database: Add ratings table
  - Backend: Rating API endpoints
  - Frontend: Rating component with stars
```

**Step 2: Database Schema Design**

**Create Migration:**
```sql
-- migrations/006_add_ratings.sql
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  rater_id INTEGER REFERENCES users(id),
  rated_id INTEGER REFERENCES users(id),
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_id, rater_id)
);

CREATE INDEX idx_ratings_rated ON ratings(rated_id);
```

**Step 3: Backend Implementation**

**A. Create Service Layer:**
```typescript
// backend/src/ratings.service.ts
export async function createRating(
  bookingId: number,
  raterId: number,
  ratedId: number,
  stars: number,
  review: string
): Promise<Rating> {
  // Validate booking exists and trip completed
  const booking = await getBooking(bookingId);
  if (!booking) throw new Error('Booking not found');
  
  // Check trip is in the past
  const route = await getRoute(booking.route_id);
  if (new Date(route.datetime) > new Date()) {
    throw new Error('Cannot rate before trip completion');
  }
  
  // Prevent duplicate rating
  const existing = await db.query(
    'SELECT id FROM ratings WHERE booking_id = $1 AND rater_id = $2',
    [bookingId, raterId]
  );
  if (existing.rows.length > 0) {
    throw new Error('Already rated this booking');
  }
  
  // Insert rating
  const result = await db.query(
    'INSERT INTO ratings (booking_id, rater_id, rated_id, stars, review) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [bookingId, raterId, ratedId, stars, review]
  );
  
  return result.rows[0];
}

export async function getUserRatings(userId: number): Promise<Rating[]> {
  const result = await db.query(
    'SELECT r.*, u.name as rater_name FROM ratings r JOIN users u ON r.rater_id = u.id WHERE r.rated_id = $1 ORDER BY r.created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function getAverageRating(userId: number): Promise<number> {
  const result = await db.query(
    'SELECT AVG(stars) as average FROM ratings WHERE rated_id = $1',
    [userId]
  );
  return result.rows[0].average || 0;
}
```

**B. Create API Endpoints:**
```typescript
// backend/src/index.ts
app.post('/api/bookings/:id/rate', requireAuth, async (req: AuthRequest, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const { stars, review } = req.body;
  
  try {
    // Get booking to find rated user
    const booking = await getBooking(bookingId);
    const route = await getRoute(booking.route_id);
    
    const rating = await createRating(
      bookingId,
      req.userId!,
      route.publisher_id,
      stars,
      review
    );
    
    res.status(201).json(rating);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users/:id/ratings', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const ratings = await getUserRatings(userId);
    const average = await getAverageRating(userId);
    res.json({ ratings, average });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});
```

**Step 4: Frontend Implementation**

**A. Create Rating Component:**
```typescript
// frontend/src/components/RatingForm.tsx
import React, { useState } from 'react';
import api from '../api/axios';

interface Props {
  bookingId: number;
  onSuccess: () => void;
}

export default function RatingForm({ bookingId, onSuccess }: Props) {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post(`/api/bookings/${bookingId}/rate`, {
        stars,
        review
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Rating failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Rate this trip</h3>
      
      <div>
        <label>Rating:</label>
        <div>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setStars(n)}
              style={{ 
                fontSize: 24, 
                color: n <= stars ? 'gold' : 'gray' 
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label>Review (optional):</label>
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  );
}
```

**B. Update MyBookings Component:**
```typescript
// frontend/src/components/MyBookings.tsx
import RatingForm from './RatingForm';

// Inside component
const [showRating, setShowRating] = useState<number | null>(null);

// In booking list
{bookings.map(booking => {
  const isPastTrip = new Date(booking.route.datetime) < new Date();
  
  return (
    <div key={booking.id}>
      {/* ... existing booking info ... */}
      
      {isPastTrip && !booking.rated && (
        <button onClick={() => setShowRating(booking.id)}>
          Rate this trip
        </button>
      )}
      
      {showRating === booking.id && (
        <RatingForm
          bookingId={booking.id}
          onSuccess={() => {
            setShowRating(null);
            fetchBookings(); // Refresh list
          }}
        />
      )}
    </div>
  );
})}
```

**Step 5: Testing**

**A. Unit Tests:**
```typescript
// backend/src/__tests__/ratings.service.test.ts
import { createRating, getAverageRating } from '../ratings.service';

describe('Ratings Service', () => {
  test('creates rating successfully', async () => {
    const rating = await createRating(1, 2, 1, 5, 'Great trip!');
    expect(rating.stars).toBe(5);
  });

  test('prevents rating before trip completion', async () => {
    // Mock future trip
    await expect(
      createRating(99, 2, 1, 5, 'Review')
    ).rejects.toThrow('Cannot rate before trip completion');
  });

  test('calculates average rating', async () => {
    // Mock ratings data
    const avg = await getAverageRating(1);
    expect(avg).toBeGreaterThanOrEqual(0);
    expect(avg).toBeLessThanOrEqual(5);
  });
});
```

**B. Integration Tests:**
```typescript
// backend/src/__tests__/ratings.api.test.ts
import request from 'supertest';
import app from '../index';

describe('Ratings API', () => {
  let token: string;

  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' });
    token = res.body.token;
  });

  test('POST /api/bookings/:id/rate - success', async () => {
    const res = await request(app)
      .post('/api/bookings/1/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ stars: 5, review: 'Excellent!' });

    expect(res.status).toBe(201);
    expect(res.body.stars).toBe(5);
  });

  test('GET /api/users/:id/ratings - returns ratings', async () => {
    const res = await request(app)
      .get('/api/users/1/ratings');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ratings');
    expect(res.body).toHaveProperty('average');
  });
});
```

**C. Frontend Component Tests:**
```typescript
// frontend/src/components/__tests__/RatingForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RatingForm from '../RatingForm';

test('renders rating form', () => {
  render(<RatingForm bookingId={1} onSuccess={() => {}} />);
  expect(screen.getByText('Rate this trip')).toBeInTheDocument();
});

test('allows star selection', () => {
  render(<RatingForm bookingId={1} onSuccess={() => {}} />);
  const starButtons = screen.getAllByText('★');
  fireEvent.click(starButtons[2]); // Click 3rd star
  // Verify 3 stars are highlighted
});
```

**Step 6: Documentation**

**Update API Documentation:**
```markdown
## POST /api/bookings/:id/rate
Rate a completed booking

**Authentication:** Required

**Parameters:**
- `id` (path) - Booking ID

**Request Body:**
```json
{
  "stars": 5,
  "review": "Great trip!"
}
```

**Response:** 201 Created
```json
{
  "id": 1,
  "booking_id": 1,
  "rater_id": 2,
  "rated_id": 1,
  "stars": 5,
  "review": "Great trip!",
  "created_at": "2026-06-11T10:30:00Z"
}
```

**Errors:**
- 400: Trip not completed yet
- 400: Already rated
- 401: Not authenticated
- 404: Booking not found
```

---

## How Does It Work Internally?

### Request Lifecycle

#### 1. User Logs In

```
[Browser]
   ↓ User enters email/password
[Login Component]
   ↓ AuthContext.login()
[Frontend API Client]
   ↓ POST /api/auth/login
[Express Server]
   ↓ Auth router
[Database]
   ↓ SELECT user WHERE email = ?
[Auth Service]
   ↓ Verify password with bcrypt
   ↓ Generate JWT token
[Response to Frontend]
   ↓ Store token in localStorage
[AuthContext updates]
   ↓ user state = logged in user
[UI Re-renders]
   ↓ Show dashboard
```

#### 2. User Books a Seat

```
[Browser]
   ↓ User clicks "Book" button
[RouteList Component]
   ↓ Calls api.post('/api/routes/123/book')
[Axios Interceptor]
   ↓ Adds Authorization: Bearer <token>
[Express Server]
   ↓ Route handler
[Auth Middleware]
   ↓ Verifies JWT
   ↓ Extracts userId
[Route Handler]
   ↓ Calls bookSeat(routeId, userId, seats)
[Route Service]
   ↓ Validates:
   │ - Route exists?
   │ - Not self-booking?
   │ - Seats available?
[Database Transaction]
   ↓ BEGIN
   ↓ INSERT INTO bookings
   ↓ UPDATE routes SET seats_available -= 1
   ↓ COMMIT
[Success Response]
   ↓ Return booking object
[Frontend]
   ↓ Update booking list
   ↓ Show success message
```

### Authentication Flow Deep Dive

#### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 5,
    "iat": 1717833600,
    "exp": 1718438400
  },
  "signature": "..."
}
```

#### Token Validation Process
```typescript
// 1. Extract from header
const authHeader = req.headers.authorization;
const token = authHeader.replace('Bearer ', '');

// 2. Verify signature and expiry
const decoded = jwt.verify(token, JWT_SECRET);

// 3. Extract user ID
req.userId = decoded.userId;

// 4. Proceed to handler
next();
```

### Database Transaction Flow

#### Booking with Transaction
```typescript
async function bookSeat(routeId: number, userId: number, seatsCount: number) {
  const client = await db.pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Lock row to prevent race conditions
    const routeResult = await client.query(
      'SELECT * FROM routes WHERE id = $1 FOR UPDATE',
      [routeId]
    );
    
    const route = routeResult.rows[0];
    
    // Validate
    if (route.seats_available < seatsCount) {
      throw new Error('Not enough seats');
    }
    
    // Insert booking
    const bookingResult = await client.query(
      'INSERT INTO bookings (route_id, user_id, seats_count) VALUES ($1, $2, $3) RETURNING *',
      [routeId, userId, seatsCount]
    );
    
    // Update seats
    await client.query(
      'UPDATE routes SET seats_available = seats_available - $1 WHERE id = $2',
      [seatsCount, routeId]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    return bookingResult.rows[0];
    
  } catch (err) {
    // Rollback on error
    await client.query('ROLLBACK');
    throw err;
  } finally {
    // Release connection
    client.release();
  }
}
```

### State Management Flow

#### React Context Pattern
```typescript
// 1. Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Provider Component
export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and load user
      verifyToken(token).then(setUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Use in Components
function SomeComponent() {
  const { user, login, logout } = useAuth();
  // Use auth state
}
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Cannot connect to database

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
```bash
# Check if PostgreSQL is running
docker compose ps

# If not running, start it
docker compose up -d

# Check logs
docker compose logs db

# Verify DATABASE_URL in backend/.env
cat backend/.env | grep DATABASE_URL
```

#### 2. JWT token invalid

**Symptoms:**
```
401 Unauthorized: Invalid token
```

**Solutions:**
```bash
# Clear localStorage in browser console
localStorage.clear()

# Login again

# Check JWT_SECRET matches in backend/.env
# Restart backend server after changing .env
```

#### 3. Routes not showing

**Symptoms:**
- Empty route list
- "Loading..." never finishes

**Solutions:**
```bash
# Check backend is running
curl http://localhost:4000/api/health

# Check database has routes
psql carpool -c "SELECT COUNT(*) FROM routes;"

# Check browser console for errors
# F12 → Console tab

# Check network tab for API response
# F12 → Network tab → Click XHR
```

#### 4. Cannot book seats

**Symptoms:**
```
Error: Cannot book your own route
Error: Not enough seats available
```

**Solutions:**
```
# Self-booking error:
- This is intentional protection
- Use a different user account
- Create test users with seed script

# No seats available:
- Check route has seats_available > 0
- Someone may have booked simultaneously
- Refresh the page to see updated seats
```

#### 5. MCP server not working

**Symptoms:**
```
Error: Cannot connect to MCP server
Error: GITHUB_TOKEN not set
```

**Solutions:**
```bash
# Check GITHUB_TOKEN in backend/.env
cat backend/.env | grep GITHUB_TOKEN

# Generate new token at:
# https://github.com/settings/tokens

# Required scopes:
# - repo (full control)
# - admin:org (read:org)

# Test MCP client
cd backend
npm run mcp:test
```

### Error Messages Reference

| Error | Meaning | Solution |
|-------|---------|----------|
| `Email already exists` | Registration with existing email | Use different email or login |
| `Invalid credentials` | Wrong email/password | Check credentials, reset password (future) |
| `No token provided` | Not authenticated | Login first |
| `Invalid token` | Token expired/corrupt | Clear localStorage and login again |
| `Cannot book your own route` | Self-booking attempt | Use different account |
| `Not enough seats available` | Seat limit reached | Choose different route |
| `Route not found` | Invalid route ID | Refresh route list |
| `server error` | Backend crash | Check backend logs |

### Performance Issues

**Slow page load:**
```bash
# Check database query performance
psql carpool -c "EXPLAIN ANALYZE SELECT * FROM routes;"

# Add missing indexes
psql carpool -c "CREATE INDEX idx_routes_datetime ON routes(datetime);"

# Check backend response times
# Add logging in backend/src/index.ts
console.time('api-routes');
// ... query code ...
console.timeEnd('api-routes');
```

**High database connections:**
```typescript
// Check pool configuration in backend/src/db.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,  // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

**Last Updated:** 2026-06-11  
**Version:** 1.0.0  
**For Questions:** Check other documentation files or contact development team

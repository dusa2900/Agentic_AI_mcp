# AI Agent Guidelines for Vehicle Routing & Carpooling App

## Project Overview
A React-based vehicle pooling platform where users can publish route plans and other users can book seats or offer reverse-route seats. Core constraints: **4 seats max per vehicle**, **comments/chat** for communication between publisher and travelers.

## Architecture & Key Concepts

### Data Models
- **Route Plan**: Published by a user with departure/arrival details, schedule, seat availability
- **Booking**: User reserves a seat on an existing route (confirms traveler)
- **Seat**: 4-seat capacity; track reserved, available, pending states
- **Comment/Message**: Chat-like messaging between route publisher and travelers (or between travelers)
- **Travel History**: Complete record of user's past activities (both as publisher and traveler)
  - **Publisher History**: All routes published, total seats offered, completion rate, cancellation count
  - **Traveler History**: All bookings made, trips completed, routes canceled, reliability score
  - Includes: trip date, route details, status (completed/canceled), co-travelers count, ratings (if applicable)

### Component Structure
Organize by feature domains:
- `src/components/Routes/` — Route creation, listing, detail views
- `src/components/Bookings/` — Booking management, seat selection UI
- `src/components/Chat/` — Comments/messaging interface
- `src/components/User/` — User profile, published routes, bookings history, travel history (publisher/traveler stats)
- `src/components/Common/` — Shared UI (buttons, modals, cards)

### State Management & API Layer
- Use a predictable pattern (Context API, Redux, or Zustand) for:
  - User authentication state
  - Active route details
  - User's bookings & published routes
  - Real-time messaging/comments
- Create an API service layer in `src/api/` with endpoints for:
  - `GET /routes` — List all available routes
  - `POST /routes` — Create new route (publisher)
  - `POST /routes/:id/book` — Book a seat
  - `DELETE /routes/:id/book` — Cancel booking
  - `POST /routes/:id/comments` — Add comment
  - `GET /routes/:id/comments` — Fetch comments
  - `GET /users/:id/travel-history` — Fetch user's complete travel history (published routes + bookings)
  - `GET /users/:id/publisher-history` — Fetch routes published by user with statistics
  - `GET /users/:id/traveler-history` — Fetch bookings/trips made by user with statistics

### Common Patterns
- **Seat availability**: Track real-time; prevent overbooking (validate 4-seat max before mutation)
- **User roles**: Distinguish between **publisher** (route owner) and **traveler** (booker)
- **Comments**: Thread-like; scoped to route; include author, timestamp, optional instruction tags
- **State transitions**: Routes (draft → published → completed), Bookings (pending → confirmed → completed), Seats (available → reserved → occupied)
- **Travel history tracking**: 
  - Maintain complete audit trail of user activities (both as publisher and traveler)
  - Calculate metrics: completion rate, cancellation rate, reliability score
  - Display separate tabs/sections for "Routes Published" vs "Trips Taken"
  - Show historical data with filters: completed, canceled, ongoing
  - Use history data for user reputation/trust indicators

## Development Workflow

### Setup & Build
```bash
npm install
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run test suite (if configured)
```

### Key Files & Conventions
- Component files: PascalCase (`RouteCard.jsx`, `BookingForm.jsx`)
- Utility files: camelCase (`formatDate.js`, `calculateDistance.js`)
- Styles: Co-locate or use CSS modules (`Component.module.css`)
- Constants: `src/constants/` for enums, magic numbers, API endpoints
- Hooks: `src/hooks/` for custom React hooks (e.g., `useRoute.js`, `useBooking.js`)

### Testing & Validation
- Unit tests for business logic (seat availability, overbooking prevention)
- Integration tests for booking workflows (publish → book → comment → confirm)
- Form validation: Validate seat count, user permissions, route times before API calls

## Common Tasks & Tips

### Adding a New Feature
1. Define data model & API endpoint
2. Create component(s) with form/UI
3. Wire to state management
4. Add comments/chat if user interaction involved
5. Test edge cases: empty routes, full seats, same-route reverse bookings

### Handling Comments/Chat
- Store comments as an array on each route
- Each comment: `{ id, author, content, timestamp, isInstruction }`
- Instruction comments: Special flag for publisher guidance to travelers
- Sort by timestamp; real-time updates via polling or WebSocket (if backend supports)

### Seat Management
- Always validate: `availableSeats > 0` before booking
- On booking: `availableSeats--`, add traveler to `bookedBy` array
- On cancellation: `availableSeats++`, remove from `bookedBy`
- Show visual seat grid (4 boxes) with status indicators

### Permission Checks
- Only route **publisher** can edit route details or mark complete
- Only **travelers** on a route can comment (unless restricted)
- Prevent self-booking

## Pitfalls & Edge Cases
- **Double-booking**: Implement optimistic locking or transaction-based seat reservations
- **Stale data**: Refresh route details before confirming booking if user navigates away
- **Comment permissions**: Clarify who can post (all travelers? publisher only?)
- **Reverse routes**: If supporting same-route returns, track direction to avoid conflicts
- **Timezone handling**: Store times in UTC; display in user's local timezone

## File Structure (Expected)
```
src/
  ├── components/
  │   ├── Routes/
  │   ├── Bookings/
  │   ├── Chat/
  │   ├── User/
  │   └── Common/
  ├── hooks/
  ├── api/
  ├── constants/
  ├── utils/
  ├── App.jsx
  └── main.jsx
public/
package.json
```

## Questions for Clarification
- Is this a backend provided, or do I need to scaffold mock API endpoints?
- Should comments be real-time (WebSocket) or polling-based?
- Are reverse routes (same origin/destination, opposite direction) a core feature?
- Do travelers see each other's details or remain anonymous?

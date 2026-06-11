# Carpooling Platform - System Architecture

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Data Models](#data-models)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [MCP Layer Architecture](#mcp-layer-architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication & Security](#authentication--security)
- [Deployment Architecture](#deployment-architecture)

---

## System Overview

The Carpooling Platform is a full-stack web application that enables users to share vehicle routes and book seats. The system is built with modern web technologies and follows a three-tier architecture pattern.

### Key Features
- 👤 **User Authentication** - JWT-based secure authentication
- 🚗 **Route Management** - Create, list, and manage carpooling routes
- 💺 **Seat Booking** - Real-time seat availability with 4-seat limit
- 💬 **Communication** - Comments and messaging between users
- 📊 **History Tracking** - Complete travel history for publishers and travelers
- 🤖 **MCP Integration** - GitHub operations via Model Context Protocol
- 🎯 **AI Agent Orchestration** - Automated development workflows

---

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Claude[Claude Desktop]
    end

    subgraph "Frontend - React + Vite"
        App[App Component]
        Auth[AuthContext]
        Routes[Route Components]
        Bookings[Booking Components]
        Comments[Comment Components]
        API[API Client - Axios]
    end

    subgraph "Backend - Node.js + Express"
        Server[Express Server]
        AuthAPI[Auth API]
        RoutesAPI[Routes API]
        BookingsAPI[Bookings API]
        CommentsAPI[Comments API]
        Middleware[Auth Middleware]
        RouteService[Route Service]
    end

    subgraph "MCP Layer"
        MCPServer[MCP Server]
        MCPClient[MCP Client]
        GitHubTools[GitHub Tools]
        Schemas[Tool Schemas]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL DB)]
        Tables[Users, Routes, Bookings, Comments]
    end

    subgraph "External Services"
        GitHub[GitHub API]
    end

    Browser --> App
    Claude --> MCPClient
    App --> Auth
    App --> Routes
    App --> Bookings
    App --> Comments
    Routes --> API
    Bookings --> API
    Comments --> API
    API --> Server
    Server --> AuthAPI
    Server --> RoutesAPI
    Server --> BookingsAPI
    Server --> CommentsAPI
    Server --> Middleware
    RoutesAPI --> RouteService
    BookingsAPI --> RouteService
    RouteService --> PostgreSQL
    AuthAPI --> PostgreSQL
    CommentsAPI --> PostgreSQL
    PostgreSQL --> Tables
    MCPClient --> MCPServer
    MCPServer --> GitHubTools
    GitHubTools --> GitHub
    MCPServer --> Schemas
```

---

## Technology Stack

### Frontend Stack
```yaml
Framework: React 18
Language: TypeScript
Build Tool: Vite
Styling: CSS (inline styles currently)
HTTP Client: Axios
State Management: React Context API
Authentication: JWT tokens in localStorage
Testing: Jest + React Testing Library
```

### Backend Stack
```yaml
Runtime: Node.js (v18+)
Framework: Express.js
Language: TypeScript
Database: PostgreSQL
ORM: pg (node-postgres)
Authentication: JWT (jsonwebtoken)
Validation: Manual validation
Testing: Jest
API Documentation: Manual
```

### MCP Layer Stack
```yaml
Protocol: JSON-RPC 2.0
SDK: @modelcontextprotocol/sdk
Validation: Zod
GitHub API: Octokit (@octokit/rest)
Transport: stdio, HTTP
Tool Count: 6 tools
Resource Count: 3 resources
```

### DevOps Stack
```yaml
Database: Docker (docker-compose)
Version Control: Git
CI/CD: GitHub Actions (planned)
Package Manager: npm
Environment: .env files
```

---

## Data Models

### User Model
```typescript
interface User {
  id: number;              // Primary key
  email: string;           // Unique, required
  name: string;            // Display name
  password_hash: string;   // Bcrypt hashed
  created_at: Date;        // Timestamp
}
```

### Route Model
```typescript
interface Route {
  id: number;              // Primary key
  origin: string;          // Departure location
  destination: string;     // Arrival location
  datetime: Date;          // Journey date/time
  seats_total: number;     // Total seats (default: 4)
  seats_available: number; // Available seats
  publisher_id: number;    // FK to users
  created_at: Date;        // Timestamp
  updated_at: Date;        // Timestamp
}
```

### Booking Model
```typescript
interface Booking {
  id: number;              // Primary key
  route_id: number;        // FK to routes
  user_id: number;         // FK to users
  seats_count: number;     // Number of seats booked
  status: string;          // 'pending' | 'confirmed' | 'cancelled'
  created_at: Date;        // Timestamp
}
```

### Comment Model
```typescript
interface Comment {
  id: number;              // Primary key
  route_id: number;        // FK to routes
  user_id: number;         // FK to users
  content: string;         // Message content
  is_instruction: boolean; // Publisher instruction flag
  created_at: Date;        // Timestamp
}
```

---

## Frontend Architecture

### Component Structure
```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Root component
├── AuthContext.tsx          # Auth state management
├── styles.css               # Global styles
├── api/
│   └── axios.ts            # Axios instance with interceptors
└── components/
    ├── Login.tsx           # Login/Register form
    ├── RouteList.tsx       # List all routes
    ├── PublishRoute.tsx    # Create new route form
    ├── MyBookings.tsx      # User's bookings list
    ├── Comments.tsx        # Comments component
    └── __tests__/
        └── Login.test.tsx  # Component tests
```

### Component Hierarchy
```mermaid
graph TD
    App[App Component]
    Auth{User Authenticated?}
    Login[Login Component]
    Dashboard[Dashboard Layout]
    RouteList[RouteList Component]
    PublishRoute[PublishRoute Component]
    MyBookings[MyBookings Component]
    Comments[Comments Component]

    App --> Auth
    Auth -->|No| Login
    Auth -->|Yes| Dashboard
    Dashboard --> RouteList
    Dashboard --> PublishRoute
    Dashboard --> MyBookings
    RouteList --> Comments
```

### State Management

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

#### Component State Pattern
```typescript
// Each component manages its own local state
const [routes, setRoutes] = useState<Route[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### API Integration
```typescript
// Axios instance with JWT interceptor
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Backend Architecture

### Server Structure
```
backend/src/
├── index.ts                # Express server entry point
├── db.ts                   # PostgreSQL connection
├── auth.ts                 # Auth routes (login/register)
├── routes.service.ts       # Route business logic
├── store.ts                # In-memory store (legacy)
├── middleware/
│   └── auth.ts            # JWT authentication middleware
├── mcp/
│   ├── server/
│   │   └── index.ts       # MCP server implementation
│   ├── client/
│   │   └── github-mcp-client.ts  # MCP client
│   ├── github/
│   │   ├── github.tools.ts       # GitHub tool implementations
│   │   └── github.service.ts     # GitHub service wrapper
│   ├── schemas/
│   │   └── github-tools.schema.ts # Tool definitions
│   └── github-agent/
│       └── index.ts       # GitHub agent orchestration
└── __tests__/
    └── routes.service.test.ts    # Service tests
```

### Layered Architecture
```mermaid
graph TB
    subgraph "Presentation Layer"
        Routes[Express Routes]
        Middleware[Middleware]
    end

    subgraph "Business Logic Layer"
        RouteService[Route Service]
        AuthService[Auth Service]
        BookingLogic[Booking Logic]
    end

    subgraph "Data Access Layer"
        DB[PostgreSQL Client]
        Queries[SQL Queries]
    end

    subgraph "External Integration Layer"
        MCPServer[MCP Server]
        GitHubTools[GitHub Tools]
    end

    Routes --> Middleware
    Middleware --> RouteService
    Middleware --> AuthService
    RouteService --> BookingLogic
    RouteService --> DB
    AuthService --> DB
    DB --> Queries
    Routes --> MCPServer
    MCPServer --> GitHubTools
```

### Business Logic - Route Service

#### Key Functions
```typescript
// Route management
listRoutes(): Promise<Route[]>
createRoute(userId: number, data: RouteInput): Promise<Route>
getRoute(routeId: number): Promise<Route | null>

// Booking logic
bookSeat(routeId: number, userId: number, seatsCount: number): Promise<Booking>
cancelBooking(bookingId: number, userId: number): Promise<void>
getUserBookings(userId: number): Promise<Booking[]>

// Validation
validateSeatAvailability(routeId: number, seatsCount: number): Promise<boolean>
preventSelfBooking(routeId: number, userId: number): Promise<void>
```

#### Booking Validation Logic
```typescript
async function bookSeat(routeId: number, userId: number, seatsCount: number) {
  // 1. Check route exists
  const route = await getRoute(routeId);
  if (!route) throw new Error('Route not found');

  // 2. Prevent self-booking
  if (route.publisher_id === userId) {
    throw new Error('Cannot book your own route');
  }

  // 3. Check seat availability
  if (route.seats_available < seatsCount) {
    throw new Error('Not enough seats available');
  }

  // 4. Create booking and update seats (transaction)
  return db.transaction(async (client) => {
    const booking = await createBooking(client, {
      route_id: routeId,
      user_id: userId,
      seats_count: seatsCount
    });

    await updateSeats(client, routeId, -seatsCount);

    return booking;
  });
}
```

---

## MCP Layer Architecture

### MCP Overview
Model Context Protocol (MCP) is a standardized protocol for connecting AI models to external tools and data sources.

### MCP Server Architecture
```mermaid
graph LR
    subgraph "MCP Client"
        Claude[Claude Desktop]
        VSCode[VS Code Copilot]
        CustomClient[Custom Client]
    end

    subgraph "MCP Protocol Layer"
        Protocol[JSON-RPC 2.0]
        Transport[stdio/HTTP Transport]
    end

    subgraph "MCP Server"
        Server[MCP Server]
        ToolRegistry[Tool Registry]
        ResourceRegistry[Resource Registry]
        Handlers[Request Handlers]
    end

    subgraph "Implementation Layer"
        GitHubTools[GitHub Tools]
        Octokit[Octokit Client]
    end

    Claude --> Protocol
    VSCode --> Protocol
    CustomClient --> Protocol
    Protocol --> Transport
    Transport --> Server
    Server --> ToolRegistry
    Server --> ResourceRegistry
    Server --> Handlers
    Handlers --> GitHubTools
    GitHubTools --> Octokit
```

### MCP Tools Available

#### 1. create_branch
```typescript
{
  name: 'create_branch',
  description: 'Create a new branch in a GitHub repository',
  inputSchema: {
    branchName: string,      // Required
    owner: string,           // Optional (from config)
    repo: string,            // Optional (from config)
    baseBranch: string       // Optional (default: main)
  }
}
```

#### 2. commit_changes
```typescript
{
  name: 'commit_changes',
  description: 'Commit file changes to a GitHub branch',
  inputSchema: {
    branch: string,          // Required
    message: string,         // Required
    files: Array<{           // Required
      path: string,
      content: string
    }>,
    owner: string,           // Optional
    repo: string             // Optional
  }
}
```

#### 3. list_repositories
```typescript
{
  name: 'list_repositories',
  description: 'List GitHub repositories for authenticated user',
  inputSchema: {
    type: 'all' | 'owner' | 'member',  // Optional
    sort: 'created' | 'updated' | 'pushed' | 'full_name'  // Optional
  }
}
```

#### 4. get_issues
```typescript
{
  name: 'get_issues',
  description: 'Get issues from a GitHub repository',
  inputSchema: {
    owner: string,           // Optional
    repo: string,            // Optional
    state: 'open' | 'closed' | 'all',  // Optional
    labels: string[]         // Optional
  }
}
```

#### 5. get_merge_conflicts
```typescript
{
  name: 'get_merge_conflicts',
  description: 'Check for merge conflicts between branches',
  inputSchema: {
    baseBranch: string,      // Required
    headBranch: string,      // Required
    owner: string,           // Optional
    repo: string             // Optional
  }
}
```

#### 6. get_errors_from_checks
```typescript
{
  name: 'get_errors_from_checks',
  description: 'Get errors from GitHub CI/CD checks',
  inputSchema: {
    ref: string,             // Required (branch/commit)
    owner: string,           // Optional
    repo: string             // Optional
  }
}
```

### MCP Resources

#### 1. github://repositories
```typescript
{
  uri: 'github://repositories',
  name: 'GitHub Repositories',
  description: 'List of user repositories',
  mimeType: 'application/json'
}
```

#### 2. github://issues/{owner}/{repo}
```typescript
{
  uri: 'github://issues/{owner}/{repo}',
  name: 'Repository Issues',
  description: 'Issues for a specific repository',
  mimeType: 'application/json'
}
```

#### 3. github://conflicts/{owner}/{repo}/{base}/{head}
```typescript
{
  uri: 'github://conflicts/{owner}/{repo}/{base}/{head}',
  name: 'Merge Conflicts',
  description: 'Merge conflicts between branches',
  mimeType: 'application/json'
}
```

---

## Database Schema

### Entity Relationship Diagram
```mermaid
erDiagram
    USERS ||--o{ ROUTES : publishes
    USERS ||--o{ BOOKINGS : makes
    USERS ||--o{ COMMENTS : writes
    ROUTES ||--o{ BOOKINGS : contains
    ROUTES ||--o{ COMMENTS : has

    USERS {
        int id PK
        string email UK
        string name
        string password_hash
        timestamp created_at
    }

    ROUTES {
        int id PK
        string origin
        string destination
        timestamp datetime
        int seats_total
        int seats_available
        int publisher_id FK
        timestamp created_at
        timestamp updated_at
    }

    BOOKINGS {
        int id PK
        int route_id FK
        int user_id FK
        int seats_count
        string status
        timestamp created_at
    }

    COMMENTS {
        int id PK
        int route_id FK
        int user_id FK
        text content
        boolean is_instruction
        timestamp created_at
    }
```

### SQL Schema Definition
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    seats_total INTEGER DEFAULT 4,
    seats_available INTEGER DEFAULT 4,
    publisher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seats_count INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, user_id)
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_instruction BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_routes_publisher ON routes(publisher_id);
CREATE INDEX idx_routes_datetime ON routes(datetime);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_route ON bookings(route_id);
CREATE INDEX idx_comments_route ON comments(route_id);
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```typescript
Request:
{
  email: string,
  password: string,
  name: string
}

Response:
{
  token: string,
  user: {
    id: number,
    email: string,
    name: string
  }
}
```

#### POST /api/auth/login
```typescript
Request:
{
  email: string,
  password: string
}

Response:
{
  token: string,
  user: {
    id: number,
    email: string,
    name: string
  }
}
```

### Route Endpoints

#### GET /api/routes
```typescript
Response:
Route[] // Array of all available routes

Route: {
  id: number,
  origin: string,
  destination: string,
  datetime: string,
  seats_total: number,
  seats_available: number,
  publisher_id: number,
  publisher_name: string,
  publisher_email: string
}
```

#### POST /api/routes
```typescript
Headers:
Authorization: Bearer <token>

Request:
{
  origin: string,
  destination: string,
  datetime: string,
  seats_total?: number  // Default: 4
}

Response:
Route  // Created route object
```

#### POST /api/routes/:id/book
```typescript
Headers:
Authorization: Bearer <token>

Request:
{
  seats?: number  // Default: 1
}

Response:
Booking  // Created booking object

Errors:
400 - Cannot book your own route
400 - Not enough seats available
404 - Route not found
```

### Booking Endpoints

#### GET /api/bookings
```typescript
Headers:
Authorization: Bearer <token>

Response:
Booking[]  // Array of user's bookings with route details

Booking: {
  id: number,
  route_id: number,
  seats_count: number,
  status: string,
  created_at: string,
  route: {
    origin: string,
    destination: string,
    datetime: string,
    publisher_name: string
  }
}
```

### Comment Endpoints

#### GET /api/routes/:id/comments
```typescript
Response:
Comment[]  // Array of comments for the route

Comment: {
  id: number,
  route_id: number,
  user_id: number,
  content: string,
  is_instruction: boolean,
  created_at: string,
  name: string,
  email: string
}
```

#### POST /api/routes/:id/comments
```typescript
Headers:
Authorization: Bearer <token>

Request:
{
  content: string,
  is_instruction?: boolean  // Default: false
}

Response:
Comment  // Created comment object
```

---

## Authentication & Security

### JWT Authentication Flow
```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Backend
    participant DB

    Client->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: Verify credentials
    DB-->>Backend: User found
    Backend->>Backend: Generate JWT
    Backend-->>Frontend: Return token + user
    Frontend->>Frontend: Store token in localStorage
    Frontend->>Backend: API request with token
    Backend->>Backend: Verify JWT
    Backend->>Backend: Extract userId
    Backend->>DB: Query with userId
    DB-->>Backend: Return data
    Backend-->>Frontend: Return response
```

### Security Measures

#### Password Hashing
```typescript
import bcrypt from 'bcryptjs';

// Registration
const salt = await bcrypt.genSalt(10);
const password_hash = await bcrypt.hash(password, salt);

// Login verification
const isValid = await bcrypt.compare(password, user.password_hash);
```

#### JWT Token Generation
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);
```

#### Auth Middleware
```typescript
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

#### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Security Best Practices
- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens expire after 7 days
- ✅ Environment variables for secrets
- ✅ SQL parameterized queries (prevents injection)
- ✅ CORS configured for specific origins
- ✅ Auth required for protected endpoints
- ⚠️ HTTPS required in production
- ⚠️ Rate limiting recommended
- ⚠️ Input validation recommended (Zod/Joi)

---

## Deployment Architecture

### Development Environment
```yaml
Frontend: http://localhost:5173 (Vite dev server)
Backend: http://localhost:4000 (Express server)
Database: localhost:5432 (Docker PostgreSQL)
MCP Server: stdio transport (local development)
```

### Production Architecture (Recommended)
```mermaid
graph TB
    subgraph "CDN"
        Static[Static Assets]
    end

    subgraph "Frontend Hosting - Vercel/Netlify"
        FrontendApp[React Build]
    end

    subgraph "Backend Hosting - Heroku/Railway"
        BackendApp[Node.js Server]
        MCPServer[MCP Server]
    end

    subgraph "Database - Neon/Supabase"
        PostgreSQL[(PostgreSQL)]
    end

    subgraph "External Services"
        GitHub[GitHub API]
    end

    Users[Users] --> Static
    Static --> FrontendApp
    FrontendApp --> BackendApp
    BackendApp --> PostgreSQL
    MCPServer --> GitHub
    BackendApp --> MCPServer
```

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET=your-secret-key-here

# Server
PORT=4000
NODE_ENV=production

# MCP / GitHub
GITHUB_TOKEN=github_pat_xxxxx
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo
```

#### Frontend (.env)
```bash
# API Base URL
VITE_API_URL=https://api.yourapp.com

# Feature Flags
VITE_ENABLE_MCP=true
```

---

## Performance Considerations

### Database Optimization
- Indexes on foreign keys and frequently queried columns
- Connection pooling for concurrent requests
- Prepared statements for query optimization
- Transactions for atomic operations

### Caching Strategy
```typescript
// Route list caching (recommended)
const cache = new Map();

async function listRoutes() {
  const cacheKey = 'all_routes';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 60000) {
    return cached.data;
  }

  const routes = await db.query('SELECT * FROM routes...');
  cache.set(cacheKey, {
    data: routes.rows,
    timestamp: Date.now()
  });

  return routes.rows;
}
```

### Frontend Optimization
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Debouncing for search inputs
- Pagination for large lists
- Image optimization and lazy loading

---

## Scalability Considerations

### Horizontal Scaling
```yaml
Load Balancer:
  - Distribute requests across multiple backend instances
  - Session management via JWT (stateless)
  - Database connection pooling

Database Scaling:
  - Read replicas for query distribution
  - Write-ahead logging for performance
  - Partitioning by date (for route history)
  
Caching Layer:
  - Redis for session storage
  - Redis for route list caching
  - CDN for static assets
```

### Microservices Migration Path
```yaml
Current: Monolithic
Future: Microservices

Services to Extract:
  1. Auth Service (users, authentication)
  2. Route Service (routes, bookings)
  3. Communication Service (comments, notifications)
  4. MCP Service (GitHub integration)
  5. Analytics Service (travel history, metrics)
```

---

**Last Updated:** 2026-06-11  
**Version:** 1.0.0  
**Architecture Review:** Pending

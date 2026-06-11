import dotenv from 'dotenv'
// Load .env file FIRST before any other imports that use env vars
dotenv.config()

import express from 'express'
import cors from 'cors'
import db from './db'
import authRouter from './auth'
import { requireAuth, optionalAuth, AuthRequest } from './middleware/auth'
import * as routeService from './routes.service'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))

// auth
app.use('/api/auth', authRouter)

// routes endpoints (DB-backed)
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await routeService.listRoutes()
    res.json(routes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/routes', requireAuth, async (req: AuthRequest, res) => {
  const { origin, destination, datetime, seats_total } = req.body
  if (!origin || !destination || !datetime) return res.status(400).json({ error: 'missing fields' })
  try {
    const route = await routeService.createRoute(req.userId!, { origin, destination, datetime, seats_total: seats_total || 4 })
    res.status(201).json(route)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/routes/:id/book', requireAuth, async (req: AuthRequest, res) => {
  const routeId = parseInt(req.params.id, 10)
  const seatsCount = req.body.seats || 1
  try {
    const booking = await routeService.bookSeat(routeId, req.userId!, seatsCount)
    res.json(booking)
  } catch (err: any) {
    console.error(err)
    res.status(400).json({ error: err.message || 'booking failed' })
  }
})

app.get('/api/bookings', requireAuth, async (req: AuthRequest, res) => {
  try {
    const bookings = await routeService.getUserBookings(req.userId!)
    res.json(bookings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

// comments
app.get('/api/routes/:id/comments', async (req, res) => {
  const routeId = parseInt(req.params.id, 10)
  try {
    const result = await db.query(
      'SELECT c.*, u.name, u.email FROM comments c JOIN users u ON c.user_id = u.id WHERE c.route_id = $1 ORDER BY c.created_at ASC',
      [routeId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/routes/:id/comments', requireAuth, async (req: AuthRequest, res) => {
  const routeId = parseInt(req.params.id, 10)
  const { content, is_instruction } = req.body
  if (!content) return res.status(400).json({ error: 'content required' })
  try {
    const result = await db.query(
      'INSERT INTO comments (route_id, user_id, content, is_instruction) VALUES ($1, $2, $3, $4) RETURNING *',
      [routeId, req.userId, content, is_instruction || false]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

const port = process.env.PORT || 4000

async function start() {
  console.log('Starting backend server...')
  console.log('DATABASE_URL:', (process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/carpool').replace(/:[^:@]+@/, ':****@'))
  
  try {
    console.log('Initializing database...')
    await db.init()
    console.log('✅ Database initialized successfully')
    
    // Verify tables exist
    const tableCheck = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'routes', 'bookings', 'comments')
    `)
    console.log('📊 Tables found:', tableCheck.rows.map(r => r.table_name).join(', '))
    
  } catch (err: any) {
    console.error('❌ DB init failed:', err.message)
    console.error('Full error:', err)
    console.error('Make sure your DATABASE_URL is set correctly and the database is accessible')
    console.error('Run "node test-db.js" to test your database connection')
    process.exit(1)
  }
  
  app.listen(port, () => console.log(`✅ Backend listening on http://localhost:${port}`))
}

start()

import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from './db'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const hash = await bcrypt.hash(password, 10)
  try {
    const result = await db.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name', [email, hash, name])
    const user = result.rows[0]
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ user, token })
  } catch (err: any) {
    if (err.code === '23505') return res.status(400).json({ error: 'email already exists' })
    console.error('❌ Signup error:', err.message, err.code)
    res.status(500).json({ error: 'server error', details: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  try {
    console.log('🔍 Login attempt for:', email)
    const result = await db.query('SELECT id, email, password, name FROM users WHERE email = $1', [email])
    console.log('📊 Query result rows:', result.rows.length)
    const user = result.rows[0]
    if (!user) {
      console.log('❌ User not found')
      return res.status(400).json({ error: 'invalid credentials' })
    }
    console.log('✅ User found, comparing password...')
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      console.log('❌ Password mismatch')
      return res.status(400).json({ error: 'invalid credentials' })
    }
    console.log('✅ Password match, generating token...')
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    delete user.password
    console.log('✅ Login successful for user:', user.id)
    res.json({ user, token })
  } catch (err: any) {
    console.error('❌ Login error:', err)
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    })
    res.status(500).json({ error: 'server error', details: err.message })
  }
})

export default router

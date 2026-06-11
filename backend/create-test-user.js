// Create a test user in the database
require('dotenv').config()
const { Pool } = require('pg')
const bcrypt = require('bcrypt')

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/carpool'
const pool = new Pool({ connectionString: DATABASE_URL })

async function createTestUser() {
  try {
    console.log('Connecting to database...')
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'traveler',
        created_at TIMESTAMP DEFAULT now()
      )
    `)
    
    const email = 'test@example.com'
    const password = 'password123'
    const name = 'Test User'
    
    console.log('Creating test user...')
    const hash = await bcrypt.hash(password, 10)
    
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET password = $2, name = $3 RETURNING id, email, name',
      [email, hash, name]
    )
    
    console.log('✅ Test user created/updated successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('User ID:', result.rows[0].id)
    
    pool.end()
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error(err)
    pool.end()
    process.exit(1)
  }
}

createTestUser()

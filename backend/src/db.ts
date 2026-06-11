import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/carpool'

const pool = new Pool({ connectionString: DATABASE_URL })

export async function query(text: string, params?: any[]) {
  return pool.query(text, params)
}

export async function init() {
  // create tables if not exist
  try {
    console.log('Creating users table...')
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
    
    console.log('Creating routes table...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        publisher_id INTEGER REFERENCES users(id),
        origin TEXT,
        destination TEXT,
        datetime_utc TIMESTAMP,
        seats_total INTEGER,
        seats_available INTEGER,
        created_at TIMESTAMP DEFAULT now()
      )
    `)
    
    console.log('Creating bookings table...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        route_id INTEGER REFERENCES routes(id),
        user_id INTEGER REFERENCES users(id),
        seats_reserved INTEGER,
        status TEXT,
        created_at TIMESTAMP DEFAULT now()
      )
    `)
    
    console.log('Creating comments table...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        route_id INTEGER REFERENCES routes(id),
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        is_instruction BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT now()
      )
    `)
    
    console.log('✅ All tables created successfully')
  } catch (err) {
    console.error('❌ Error creating tables:', err)
    throw err
  }
}

export default { query, init }

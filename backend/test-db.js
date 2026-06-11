// Quick test to verify database connection
require('dotenv').config()
const { Pool } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/carpool'

console.log('Testing database connection...')
console.log('DATABASE_URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')) // Hide password

const pool = new Pool({ connectionString: DATABASE_URL })

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection FAILED!')
    console.error('Error:', err.message)
    console.error('\nTroubleshooting:')
    console.error('1. Make sure DATABASE_URL is set correctly')
    console.error('2. Check your database is running and accessible')
    console.error('3. Verify the connection string format: postgres://user:pass@host:port/dbname')
    process.exit(1)
  } else {
    console.log('✅ Database connection successful!')
    console.log('Server time:', res.rows[0].now)
    process.exit(0)
  }
})

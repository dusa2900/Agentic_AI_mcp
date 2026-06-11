// Seed the database with dummy data
require('dotenv').config()
const { Pool } = require('pg')
const bcrypt = require('bcrypt')

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/carpool'
const pool = new Pool({ connectionString: DATABASE_URL })

async function seedData() {
  try {
    console.log('🌱 Seeding database with dummy data...')
    
    // Create test users
    console.log('Creating users...')
    const password = await bcrypt.hash('password123', 10)
    
    const users = await pool.query(`
      INSERT INTO users (email, password, name) VALUES
        ('alice@example.com', $1, 'Alice Smith'),
        ('bob@example.com', $1, 'Bob Johnson'),
        ('carol@example.com', $1, 'Carol Williams')
      ON CONFLICT (email) DO UPDATE SET password = $1, name = EXCLUDED.name
      RETURNING id, email, name
    `, [password])
    
    console.log('✅ Created users:', users.rows.map(u => u.email).join(', '))
    
    // Create sample routes
    console.log('Creating routes...')
    const now = new Date()
    
    const routes = [
      {
        publisher_id: users.rows[0].id,
        origin: 'New York, NY',
        destination: 'Boston, MA',
        datetime_utc: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        seats_total: 4,
        seats_available: 3
      },
      {
        publisher_id: users.rows[1].id,
        origin: 'San Francisco, CA',
        destination: 'Los Angeles, CA',
        datetime_utc: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        seats_total: 4,
        seats_available: 4
      },
      {
        publisher_id: users.rows[0].id,
        origin: 'Chicago, IL',
        destination: 'Detroit, MI',
        datetime_utc: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        seats_total: 4,
        seats_available: 2
      },
      {
        publisher_id: users.rows[2].id,
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        datetime_utc: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        seats_total: 4,
        seats_available: 4
      },
      {
        publisher_id: users.rows[1].id,
        origin: 'Miami, FL',
        destination: 'Orlando, FL',
        datetime_utc: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        seats_total: 4,
        seats_available: 1
      }
    ]
    
    for (const route of routes) {
      await pool.query(`
        INSERT INTO routes (publisher_id, origin, destination, datetime_utc, seats_total, seats_available)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [route.publisher_id, route.origin, route.destination, route.datetime_utc, route.seats_total, route.seats_available])
    }
    
    console.log(`✅ Created ${routes.length} sample routes`)
    
    // Show summary
    const routeCount = await pool.query('SELECT COUNT(*) FROM routes')
    const userCount = await pool.query('SELECT COUNT(*) FROM users')
    
    console.log('\n📊 Database Summary:')
    console.log(`   Users: ${userCount.rows[0].count}`)
    console.log(`   Routes: ${routeCount.rows[0].count}`)
    console.log('\n🎉 Seeding complete!')
    console.log('\nTest credentials:')
    console.log('  Email: alice@example.com')
    console.log('  Email: bob@example.com')
    console.log('  Email: carol@example.com')
    console.log('  Password: password123')
    
    pool.end()
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    console.error(err)
    pool.end()
    process.exit(1)
  }
}

seedData()

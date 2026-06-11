import db from './db'

export interface Route {
  id: number
  publisher_id: number
  origin: string
  destination: string
  datetime_utc: string
  seats_total: number
  seats_available: number
  created_at?: string
}

export async function listRoutes() {
  const result = await db.query('SELECT * FROM routes ORDER BY datetime_utc ASC')
  return result.rows
}

export async function getRoute(id: number) {
  const result = await db.query('SELECT * FROM routes WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createRoute(publisherId: number, data: { origin: string; destination: string; datetime: string; seats_total: number }) {
  const { origin, destination, datetime, seats_total } = data
  const result = await db.query(
    'INSERT INTO routes (publisher_id, origin, destination, datetime_utc, seats_total, seats_available) VALUES ($1, $2, $3, $4, $5, $5) RETURNING *',
    [publisherId, origin, destination, datetime, seats_total]
  )
  return result.rows[0]
}

export async function bookSeat(routeId: number, userId: number, seatsCount: number = 1) {
  // For now, use simple queries without explicit transactions (pg pool handles connection pooling)
  // In production, you'd want a proper transaction client from the pool
  try {
    const routeRes = await db.query('SELECT * FROM routes WHERE id = $1', [routeId])
    const route = routeRes.rows[0]
    if (!route) throw new Error('route not found')
    if (route.seats_available < seatsCount) throw new Error('not enough seats')
    
    // prevent self-booking
    if (route.publisher_id === userId) throw new Error('cannot book own route')

    await db.query('UPDATE routes SET seats_available = seats_available - $1 WHERE id = $2', [seatsCount, routeId])
    const bookingRes = await db.query(
      'INSERT INTO bookings (route_id, user_id, seats_reserved, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [routeId, userId, seatsCount, 'confirmed']
    )
    return bookingRes.rows[0]
  } catch (err) {
    throw err
  }
}

export async function getUserBookings(userId: number) {
  const result = await db.query(
    'SELECT b.*, r.origin, r.destination, r.datetime_utc FROM bookings b JOIN routes r ON b.route_id = r.id WHERE b.user_id = $1 ORDER BY b.created_at DESC',
    [userId]
  )
  return result.rows
}

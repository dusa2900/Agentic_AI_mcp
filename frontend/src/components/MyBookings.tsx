import React, { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../api/axios'

type Booking = {
  id: number
  route_id: number
  seats_reserved: number
  status: string
  created_at: string
  origin: string
  destination: string
  datetime_utc: string
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/bookings')
      .then((res) => {
        setBookings(res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ marginTop: 20 }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id} style={{ marginBottom: 10, padding: 10, border: '1px solid #ccc' }}>
              <strong>{b.origin}</strong> → <strong>{b.destination}</strong>
              <br />
              <small>
                {new Date(b.datetime_utc).toLocaleString()} | {b.seats_reserved} seat(s) | Status: {b.status}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

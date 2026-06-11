import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Comments from './Comments'

type Route = {
  id: number
  origin: string
  destination: string
  datetime_utc: string
  seats_available: number
}

export default function RouteList() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [expandedRouteId, setExpandedRouteId] = useState<number | null>(null)

  const loadRoutes = () => {
    api.get('/api/routes').then((res) => setRoutes(res.data || []))
  }

  useEffect(() => {
    loadRoutes()
  }, [])

  const bookSeat = async (routeId: number) => {
    try {
      await api.post(`/api/routes/${routeId}/book`, { seats: 1 })
      alert('Booking confirmed!')
      loadRoutes()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Booking failed')
    }
  }

  const toggleComments = (routeId: number) => {
    setExpandedRouteId(expandedRouteId === routeId ? null : routeId)
  }

  return (
    <div>
      <h2>Available Routes</h2>
      {routes.length === 0 ? (
        <p>No routes yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {routes.map((r) => (
            <li key={r.id} style={{ marginBottom: 12, border: '1px solid #ccc', padding: 10 }}>
              <strong>{r.origin}</strong> → <strong>{r.destination}</strong>
              <br />
              {new Date(r.datetime_utc).toLocaleString()} — {r.seats_available} seats available
              <br />
              <button onClick={() => bookSeat(r.id)} disabled={r.seats_available <= 0} style={{ marginTop: 6, marginRight: 6 }}>
                Book Seat
              </button>
              <button onClick={() => toggleComments(r.id)} style={{ marginTop: 6 }}>
                {expandedRouteId === r.id ? 'Hide Comments' : 'Show Comments'}
              </button>
              {expandedRouteId === r.id && <Comments routeId={r.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

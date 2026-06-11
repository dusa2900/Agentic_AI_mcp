import React, { useState } from 'react'
import api from '../api/axios'

export default function PublishRoute() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [datetime, setDatetime] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/api/routes', { origin, destination, datetime, seats_total: 4 })
    setOrigin('')
    setDestination('')
    setDatetime('')
    window.location.reload()
  }

  return (
    <div>
      <h2>Publish Route</h2>
      <form onSubmit={submit}>
        <div>
          <label>Origin</label>
          <input value={origin} onChange={(e) => setOrigin(e.target.value)} />
        </div>
        <div>
          <label>Destination</label>
          <input value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>
        <div>
          <label>Date & Time</label>
          <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
        </div>
        <button type="submit">Publish</button>
      </form>
    </div>
  )
}

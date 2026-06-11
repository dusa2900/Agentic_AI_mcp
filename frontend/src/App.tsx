import React from 'react'
import { useAuth } from './AuthContext'
import RouteList from './components/RouteList'
import PublishRoute from './components/PublishRoute'
import MyBookings from './components/MyBookings'
import Login from './components/Login'

export default function App() {
  const { user, logout } = useAuth()

  if (!user) return <Login />

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Carpool App (MVP)</h1>
        <div>
          <span>Welcome, {user.name || user.email}!</span>
          <button onClick={logout} style={{ marginLeft: 12 }}>Logout</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 2 }}>
          <RouteList />
          <MyBookings />
        </div>
        <div style={{ flex: 1 }}>
          <PublishRoute />
        </div>
      </div>
    </div>
  )
}

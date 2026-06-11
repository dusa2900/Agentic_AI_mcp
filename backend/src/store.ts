import { v4 as uuid } from 'uuid'

type Route = {
  id: string
  origin: string
  destination: string
  datetime: string
  seats_total: number
  seats_available: number
}

const routes: Route[] = []

export function listRoutes() {
  return routes
}

export function addRoute(r: Omit<Route, 'id' | 'seats_available'>) {
  const newRoute: Route = { id: uuid(), seats_available: r.seats_total, ...r }
  routes.push(newRoute)
  return newRoute
}

export function getRoute(id: string) {
  return routes.find((r) => r.id === id)
}

export function bookSeat(routeId: string) {
  const r = getRoute(routeId)
  if (!r) return null
  if (r.seats_available <= 0) return null
  r.seats_available -= 1
  return r
}

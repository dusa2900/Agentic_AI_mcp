import * as routeService from '../routes.service'
import db from '../db'

jest.mock('../db', () => ({
  query: jest.fn(),
}))

describe('Routes Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('bookSeat', () => {
    it('should prevent self-booking', async () => {
      const mockQuery = db.query as jest.MockedFunction<typeof db.query>
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, publisher_id: 100, seats_available: 3 }],
      } as any) // SELECT route

      await expect(routeService.bookSeat(1, 100, 1)).rejects.toThrow('cannot book own route')
    })

    it('should prevent overbooking', async () => {
      const mockQuery = db.query as jest.MockedFunction<typeof db.query>
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, publisher_id: 200, seats_available: 1 }],
      } as any) // SELECT route

      await expect(routeService.bookSeat(1, 100, 2)).rejects.toThrow('not enough seats')
    })

    it('should successfully book a seat', async () => {
      const mockQuery = db.query as jest.MockedFunction<typeof db.query>
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, publisher_id: 200, seats_available: 3 }],
      } as any) // SELECT route
      mockQuery.mockResolvedValueOnce({ rows: [] } as any) // UPDATE
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, route_id: 1, user_id: 100, seats_reserved: 1, status: 'confirmed' }],
      } as any) // INSERT booking

      const booking = await routeService.bookSeat(1, 100, 1)
      expect(booking.route_id).toBe(1)
      expect(booking.user_id).toBe(100)
      expect(booking.status).toBe('confirmed')
    })
  })
})

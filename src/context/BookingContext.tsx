/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import type { ReactNode } from 'react'
import api from '../api'


export interface Booking {
  id: string
  propertyId: string
  propertyName: string
  propertyImage: string
  propertyLocation: string
  userId: string
  userName: string
  userEmail: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  subtotal: number
  serviceFee: number
  total: number
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
}

export interface AdminNotification {
  id: string
  bookingId: string
  propertyName: string
  userName: string
  checkIn: string
  checkOut: string
  read: boolean
  createdAt: string
}

interface BookingContextType {
  bookings: Booking[]
  loading: boolean
  addBooking: (b: Omit<Booking, 'id' | 'createdAt' | 'userId'>) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>
  getUserBookings: (userId: string) => Booking[]
  notifications: AdminNotification[]
  unreadCount: number
  markAllRead: () => void
  markOneRead: (id: string) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const NOTIFICATIONS_KEY = 'tico-admin-notifications'

// Mapea la respuesta de MongoDB (_id) al shape del frontend (id)
function mapBooking(raw: Record<string, unknown>): Booking {
  return {
    id:               (raw._id ?? raw.id) as string,
    propertyId:       raw.propertyId as string,
    propertyName:     raw.propertyName as string,
    propertyImage:    (raw.propertyImage ?? '') as string,
    propertyLocation: (raw.propertyLocation ?? '') as string,
    userId:           (raw.userId ?? '') as string,
    userName:         (raw.userName ?? raw.guestName ?? 'Usuario') as string,
    userEmail:        (raw.userEmail ?? '') as string,
    checkIn:          typeof raw.checkIn === 'string'
                        ? raw.checkIn.split('T')[0]
                        : new Date(raw.checkIn as string).toISOString().split('T')[0],
    checkOut:         typeof raw.checkOut === 'string'
                        ? raw.checkOut.split('T')[0]
                        : new Date(raw.checkOut as string).toISOString().split('T')[0],
    guests:           (raw.guests ?? 1) as number,
    nights:           (raw.nights ?? 1) as number,
    subtotal:         (raw.subtotal ?? 0) as number,
    serviceFee:       (raw.serviceFee ?? 0) as number,
    total:            raw.total as number,
    status:           raw.status as Booking['status'],
    createdAt:        (raw.createdAt ?? new Date().toISOString()) as string,
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, user } = useAuth()
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) ?? '[]') } catch { return [] }
  })

  // Cargar reservas desde la API al montar
  useEffect(() => {
    const token = localStorage.getItem('tico-token')
    if (!token || !isAuthenticated) { 
      setBookings([])
      setLoading(false)
      return 
    }

    api.get('/bookings')
      .then(res => setBookings(res.data.map(mapBooking)))
      .catch(err => console.error('Error loading bookings:', err))
      .finally(() => setLoading(false))
  }, [isAuthenticated, user?.id])

  const persistNotifications = (list: AdminNotification[]) => {
    setNotifications(list)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list))
  }

  const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'userId'>) => {
    const res = await api.post('/bookings', {
      propertyId:       data.propertyId,
      propertyName:     data.propertyName,
      propertyImage:    data.propertyImage,
      propertyLocation: data.propertyLocation,
      userName:         data.userName,
      userEmail:        data.userEmail,
      checkIn:          data.checkIn,
      checkOut:         data.checkOut,
      guests:           data.guests,
      nights:           data.nights,
      subtotal:         data.subtotal,
      serviceFee:       data.serviceFee,
      total:            data.total,
      status:           'pending',
    })
    const booking = mapBooking(res.data)
    setBookings(prev => [booking, ...prev])
    return booking
  }

  const cancelBooking = async (id: string) => {
    const booking = bookings.find(b => b.id === id)
    await api.put(`/bookings/${id}`, { status: 'cancelled' })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))

    // Notificar al admin solo si la reserva estaba confirmada
    if (booking?.status === 'confirmed') {
      const notif: AdminNotification = {
        id:           `N${Date.now()}`,
        bookingId:    id,
        propertyName: booking.propertyName,
        userName:     booking.userName,
        checkIn:      booking.checkIn,
        checkOut:     booking.checkOut,
        read:         false,
        createdAt:    new Date().toISOString(),
      }
      persistNotifications([notif, ...notifications])
    }
  }

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    await api.put(`/bookings/${id}`, { status })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const getUserBookings = (userId: string) =>
    bookings.filter(b => b.userId === userId)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () =>
    persistNotifications(notifications.map(n => ({ ...n, read: true })))

  const markOneRead = (id: string) =>
    persistNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <BookingContext.Provider value={{
      bookings, loading,
      addBooking, cancelBooking, updateBookingStatus, getUserBookings,
      notifications, unreadCount, markAllRead, markOneRead,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, CheckCircle, Clock, XCircle, ArrowRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBookings } from '../context/BookingContext'
import type { Booking } from '../context/BookingContext'

function StatusBadge({ status }: { status: Booking['status'] }) {
  const MAP = {
    confirmed: { label: 'Confirmada', color: 'var(--forest-light)', bg: 'rgba(82,183,136,0.12)', icon: <CheckCircle size={12} /> },
    pending:   { label: 'Pendiente',  color: 'var(--gold-dark)',    bg: 'rgba(233,196,106,0.15)', icon: <Clock size={12} /> },
    cancelled: { label: 'Cancelada',  color: '#ef4444',             bg: 'rgba(239,68,68,0.1)',   icon: <XCircle size={12} /> },
  }
  const s = MAP[status]
  return (
    <span className="badge flex items-center gap-1" style={{ color: s.color, background: s.bg }}>
      {s.icon} {s.label}
    </span>
  )
}

const fmt = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })

function CancelModal({
  booking,
  onConfirm,
  onClose,
}: {
  booking: Booking
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-xl)] p-6 animate-scale-in"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)' }}
          >
            <AlertTriangle size={20} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              ¿Cancelar reserva?
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div
          className="rounded-[var(--radius-md)] p-3 mb-5 text-sm space-y-1"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
        >
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{booking.propertyName}</p>
          <p style={{ color: 'var(--text-secondary)' }}>
            {fmt(booking.checkIn)} → {fmt(booking.checkOut)}
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            {booking.guests} {booking.guests === 1 ? 'huésped' : 'huéspedes'} · ${booking.total.toLocaleString()} total
          </p>
        </div>

        {booking.status === 'confirmed' && (
          <div
            className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] mb-5 text-xs"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
          >
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>Esta reserva ya fue confirmada. Al cancelarla se notificará al administrador.</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1 justify-center py-2.5"
          >
            Mantener reserva
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 justify-center py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all"
            style={{
              background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyBookings() {
  const { user } = useAuth()
  const { getUserBookings, cancelBooking } = useBookings()
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null)

  const bookings = user ? getUserBookings(user.id) : []
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleConfirmCancel = () => {
    if (pendingCancel) {
      cancelBooking(pendingCancel.id)
      setPendingCancel(null)
    }
  }

  return (
    <>
      {pendingCancel && (
        <CancelModal
          booking={pendingCancel}
          onConfirm={handleConfirmCancel}
          onClose={() => setPendingCancel(null)}
        />
      )}

      <main style={{ paddingTop: '4rem', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container py-10 max-w-3xl mx-auto">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Mis reservas
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            {sorted.length} {sorted.length === 1 ? 'reserva' : 'reservas'} en total
          </p>

          {sorted.length === 0 ? (
            <div
              className="rounded-[var(--radius-xl)] p-12 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <Calendar size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Aún no tienes reservas
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Explora nuestras propiedades y haz tu primera reserva.
              </p>
              <Link to="/propiedades" className="btn-primary">
                Ver propiedades <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map(b => (
                <div
                  key={b.id}
                  className="rounded-[var(--radius-lg)] overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={b.propertyImage}
                      alt={b.propertyName}
                      className="w-24 h-24 rounded-[var(--radius-md)] object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                        <h3
                          className="font-semibold text-base"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                          {b.propertyName}
                        </h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="flex items-center gap-1 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={11} /> {b.propertyLocation}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} style={{ color: 'var(--accent)' }} />
                          {fmt(b.checkIn)} → {fmt(b.checkOut)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={13} style={{ color: 'var(--accent)' }} />
                          {b.guests} {b.guests === 1 ? 'huésped' : 'huéspedes'} · {b.nights} {b.nights === 1 ? 'noche' : 'noches'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                  >
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>Total: </span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        ${b.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/propiedad/${b.propertyId}`}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        Ver propiedad
                      </Link>
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => setPendingCancel(b)}
                          className="btn-secondary text-xs py-1.5 px-3"
                          style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Calendar, Users, Check } from 'lucide-react'
import { PROPERTIES, type Property } from '../data/properties'
import { useAuth } from '../context/AuthContext'
import { useBookings } from '../context/BookingContext'
import api from '../api'

export default function Booking() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addBooking } = useBookings()

  const checkIn  = searchParams.get('checkIn')  ?? ''
  const checkOut = searchParams.get('checkOut') ?? ''
  const guests   = Number(searchParams.get('guests') ?? 1)

  // 1. Buscamos primero en el archivo local
  const staticProperty = PROPERTIES.find(p => p.id === id) ?? null
  
  // 2. Estados para manejar la propiedad (local o de la DB) y la carga
  const [property, setProperty] = useState<Property | null>(staticProperty)
  const [loadingProp, setLoadingProp] = useState(!staticProperty)

  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  // 3. Efecto para buscar en el backend si no se encontró localmente
  useEffect(() => {
    if (staticProperty) return
    api.get(`/properties/${id}`)
      .then(res => {
        const raw = res.data
        setProperty({
          id: raw._id || raw.id,
          name: raw.name,
          image: raw.image,
          location: raw.location,
          price: raw.price,
          rating: raw.rating || 0,
          reviewCount: raw.reviewCount || 0,
          type: raw.type
        } as Property)
      })
      .catch(() => setProperty(null))
      .finally(() => setLoadingProp(false))
  }, [id, staticProperty])

  // Pantalla de carga mientras busca en la BD
  if (loadingProp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: '5rem', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando detalles de la propiedad...</p>
      </div>
    )
  }

  // Pantalla de error si definitivamente no existe
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: '5rem', background: 'var(--bg)' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Propiedad no encontrada
        </h2>
        <Link to="/propiedades" className="btn-primary">Ver todas las propiedades</Link>
      </div>
    )
  }

  const nights = (() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(0, Math.floor(diff / 86400000))
  })()

  const subtotal     = property.price * nights
  const serviceFee   = Math.round(subtotal * 0.12)
  const total        = subtotal + serviceFee

  const fmt = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })

const handleConfirm = async () => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      
      await addBooking({
        propertyId:       property.id,
        propertyName:     property.name,
        propertyImage:    property.image,
        propertyLocation: property.location,
        checkIn,
        checkOut,
        guests,
        nights,
        subtotal,
        serviceFee,
        total,
        status:    'pending',
        userId:    user!.id,
        userName:  user!.name,
        userEmail: user!.email,
      })
      
      setSuccess(true)
    } catch (error: any) {
      console.error("Error del servidor:", error)
      alert("El servidor rechazó la reserva. Por favor, intenta de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main style={{ paddingTop: '4rem', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container py-16 flex flex-col items-center text-center max-w-md mx-auto">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'var(--forest-light)' }}
          >
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            ¡Solicitud enviada!
          </h1>
          <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
            Tu reserva en <strong>{property.name}</strong> está pendiente de confirmación por el administrador.
          </p>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            {fmt(checkIn)} → {fmt(checkOut)} · {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
          </p>
          <p className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
            Puedes revisar el estado en "Mis reservas".
          </p>
          <div className="flex gap-3">
            <Link to="/mis-reservas" className="btn-primary">Ver mis reservas</Link>
            <Link to="/" className="btn-secondary">Ir al inicio</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '4rem', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container py-8 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost py-1 px-2 flex items-center gap-1 text-sm mb-6"
        >
          <ArrowLeft size={15} /> Volver
        </button>

        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Confirmar reserva
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — detalles */}
          <div className="space-y-6">
            {/* Propiedad */}
            <div
              className="rounded-[var(--radius-lg)] overflow-hidden flex gap-4 p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <img
                src={property.image}
                alt={property.name}
                className="w-24 h-24 object-cover rounded-[var(--radius-md)] shrink-0"
              />
              <div>
                <p className="font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {property.name}
                </p>
                <p className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={11} /> {property.location}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={11} fill="var(--gold)" stroke="none" />
                  <span style={{ color: 'var(--text-primary)' }}>{property.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({property.reviewCount} reseñas)</span>
                </div>
              </div>
            </div>

            {/* Fechas y huéspedes */}
            <div
              className="rounded-[var(--radius-lg)] p-4 space-y-3"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Tu reserva</h2>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={15} style={{ color: 'var(--accent)' }} />
                <span>{fmt(checkIn)} → {fmt(checkOut)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Users size={15} style={{ color: 'var(--accent)' }} />
                <span>{guests} {guests === 1 ? 'huésped' : 'huéspedes'} · {nights} {nights === 1 ? 'noche' : 'noches'}</span>
              </div>
            </div>

            {/* Datos del huésped */}
            <div
              className="rounded-[var(--radius-lg)] p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Datos del huésped</h2>
              <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p><span style={{ color: 'var(--text-muted)' }}>Nombre:</span> {user?.name}</p>
                <p><span style={{ color: 'var(--text-muted)' }}>Correo:</span> {user?.email}</p>
              </div>
            </div>
          </div>

          {/* Right — precio y confirmar */}
          <div>
            <div
              className="rounded-[var(--radius-xl)] p-6 sticky top-20"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
            >
              <h2 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Detalle del precio
              </h2>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>${property.price} × {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Tarifa de servicio</span>
                  <span>${serviceFee.toLocaleString()}</span>
                </div>
                <div
                  className="flex justify-between font-bold pt-3 text-base"
                  style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Confirmando…' : 'Confirmar reserva'}
              </button>

              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                No se realizará ningún cargo hasta confirmar
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
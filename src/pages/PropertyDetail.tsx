import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Star, MapPin, Users, Bed, Bath, Wifi,
  Heart, Share2, Leaf, Calendar, ChevronLeft, ChevronRight, Check
} from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import type { Property } from '../data/properties'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [property, setProperty] = useState<Property | null>(null)
  const [related, setRelated] = useState<Property[]>([])
  const [imgIdx, setImgIdx] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(true)
  const [bookingMsg, setBookingMsg] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/properties/${id}`).then(res => {
      setProperty(res.data)
      // fetch related
      api.get('/properties').then(all => {
        setRelated(all.data.filter((p: Property) => p.region === res.data.region && (p.id || p._id) !== id).slice(0, 3))
        setLoading(false)
      })
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando detalles de la propiedad...</p>
      </div>
    )
  }

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

  const allImages = property.images.length > 0 ? property.images : [property.image]

  const nights = (() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(0, Math.floor(diff / 86400000))
  })()

  const handleBooking = async () => {
    if (!user) {
      alert('Debes iniciar sesión para reservar')
      navigate('/login')
      return
    }
    if (!checkIn || !checkOut) return alert('Por favor selecciona las fechas')
    
    setIsBooking(true)
    const bookingData = {
      propertyId: property.id || property._id,
      guestName: user.name,
      guestEmail: user.email,
      checkIn,
      checkOut,
      status: 'pending',
      total: Math.round(property.price * nights * 1.12)
    }

    try {
      await api.post('/bookings', bookingData)
      setBookingMsg('¡Reserva confirmada! Hemos enviado un correo con los detalles.')
      setCheckIn('')
      setCheckOut('')
      setIsBooking(false)
    } catch (err) {
      console.error(err)
      alert('Error procesando reserva')
      setIsBooking(false)
    }
  }

  return (
    <main style={{ paddingTop: '4rem', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          <button onClick={() => navigate(-1)} className="btn-ghost py-1 px-2 flex items-center gap-1 text-sm">
            <ArrowLeft size={15} /> Volver
          </button>
          <span>/</span>
          <Link to="/propiedades" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Propiedades</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{property.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-earth capitalize">{property.type}</span>
              {property.ecoFriendly && <span className="badge badge-green"><Leaf size={10} /> Eco-friendly</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {property.name}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={14} /> {property.location}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Star size={14} fill="var(--gold)" stroke="none" />
                <strong style={{ color: 'var(--text-primary)' }}>{property.rating}</strong>
                <span style={{ color: 'var(--text-muted)' }}>({property.reviewCount} reseñas)</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="btn-secondary p-2.5"
              style={{ borderColor: wishlisted ? 'var(--earth-mid)' : undefined, color: wishlisted ? 'var(--earth-mid)' : undefined }}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <button className="btn-secondary p-2.5">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Image gallery */}
        <div className="relative rounded-[var(--radius-xl)] overflow-hidden mb-8" style={{ aspectRatio: '16/7' }}>
          <img
            src={allImages[imgIdx]}
            alt={property.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="rounded-full transition-all"
                    style={{ width: i === imgIdx ? '20px' : '8px', height: '8px', background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.5)' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main content + booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            {/* Specs */}
            <div className="flex flex-wrap gap-6 py-6 mb-6" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              {[
                { icon: Users, label: `${property.maxGuests} huéspedes` },
                { icon: Bed, label: `${property.bedrooms} ${property.bedrooms === 1 ? 'habitación' : 'habitaciones'}` },
                { icon: Bath, label: `${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'}` },
                { icon: Wifi, label: 'Wi-Fi gratis' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Acerca de este lugar
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {property.description}
              </p>
              <p className="leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>
                Ubicado en {property.location}, este {property.type} ofrece una experiencia auténtica de Costa Rica. Con capacidad para {property.maxGuests} huéspedes y {property.bedrooms} {property.bedrooms === 1 ? 'habitación' : 'habitaciones'}, es perfecto para viajes en pareja, familia o grupos pequeños que buscan conectar con la naturaleza sin renunciar al confort.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Comodidades
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} /> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Ubicación
              </h2>
              <div
                className="w-full rounded-[var(--radius-lg)] flex items-center justify-center"
                style={{ height: '220px', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
              >
                <div className="text-center">
                  <MapPin size={28} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{property.location}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Mapa disponible con integración de Google Maps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Booking card */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-20 rounded-[var(--radius-xl)] overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="p-6">
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    ${property.price}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>/noche</span>
                </div>

                <div
                  className="rounded-[var(--radius-lg)] overflow-hidden mb-4"
                  style={{ border: '1.5px solid var(--border)' }}
                >
                  <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-3">
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar size={11} className="inline mr-1" />LLEGADA
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="p-3" style={{ borderLeft: '1px solid var(--border)' }}>
                      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar size={11} className="inline mr-1" />SALIDA
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <Users size={11} className="inline mr-1" />HUÉSPEDES
                    </label>
                    <select
                      value={guests}
                      onChange={e => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent border-none outline-none text-sm"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    >
                      {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleBooking} 
                  disabled={nights === 0 || isBooking} 
                  className="btn-primary w-full justify-center py-3 text-base mb-4 disabled:opacity-50"
                  style={{ cursor: nights > 0 && !isBooking ? 'pointer' : 'not-allowed' }}
                >
                  {isBooking ? 'Procesando...' : nights > 0 ? `Reservar — $${(Math.round(property.price * nights * 1.12)).toLocaleString()}` : 'Reservar ahora'}
                </button>

                {bookingMsg && (
                  <div className="mb-4 p-3 text-sm rounded-[var(--radius-md)]" style={{ background: 'rgba(82,183,136,0.12)', color: 'var(--forest-dark)' }}>
                    {bookingMsg}
                  </div>
                )}

                {nights > 0 && (
                  <div className="space-y-2 text-sm" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                      <span>${property.price} × {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                      <span>${property.price * nights}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                      <span>Tarifa de servicio</span>
                      <span>${Math.round(property.price * nights * 0.12)}</span>
                    </div>
                    <div
                      className="flex justify-between font-semibold pt-2"
                      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      <span>Total</span>
                      <span>${Math.round(property.price * nights * 1.12).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                  No se realizará ningún cargo hasta confirmar
                </p>
              </div>

              {/* Rating */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-1">
                  <Star size={16} fill="var(--gold)" stroke="none" />
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{property.rating}</span>
                </div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {property.reviewCount} reseñas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Más en {property.region}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(p => (
                <Link
                  key={p.id || p._id}
                  to={`/propiedad/${p.id || p._id}`}
                  className="group rounded-[var(--radius-lg)] overflow-hidden no-underline card-hover"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="overflow-hidden" style={{ aspectRatio: '3/2' }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{p.name}</h3>
                    <p className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      <MapPin size={11} /> {p.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>${p.price}/noche</span>
                      <span className="flex items-center gap-1 text-xs">
                        <Star size={11} fill="var(--gold)" stroke="none" />
                        {p.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

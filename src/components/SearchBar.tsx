import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users } from 'lucide-react'

interface SearchBarProps {
  inline?: boolean
  initialValues?: {
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: number
  }
}

export default function SearchBar({ inline = false, initialValues = {} }: SearchBarProps) {
  const navigate = useNavigate()
  const [location, setLocation] = useState(initialValues.location ?? '')
  const [checkIn, setCheckIn] = useState(initialValues.checkIn ?? '')
  const [checkOut, setCheckOut] = useState(initialValues.checkOut ?? '')
  const [guests, setGuests] = useState(initialValues.guests ?? 1)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('q', location)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', String(guests))
    navigate(`/propiedades?${params.toString()}`)
  }

  if (inline) {
    return (
      <div
        className="flex flex-col sm:flex-row gap-2 p-2 rounded-[var(--radius-xl)]"
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="flex items-center gap-2 flex-1 px-3">
          <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="¿A dónde vas?"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button onClick={handleSearch} className="btn-primary text-sm py-2 px-5">
          <Search size={15} /> Buscar
        </button>
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-[var(--radius-xl)]"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-xl)',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Location */}
        <div className="flex items-center gap-3 px-5 py-4">
          <MapPin size={20} style={{ color: 'var(--forest-mid)', flexShrink: 0 }} />
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold mb-0.5" style={{ color: 'var(--forest)' }}>
              Destino
            </label>
            <input
              type="text"
              placeholder="¿A dónde vas?"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm truncate"
              style={{ color: '#1a1208', fontFamily: 'var(--font-body)' }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Calendar size={20} style={{ color: 'var(--forest-mid)', flexShrink: 0 }} />
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-0.5" style={{ color: 'var(--forest)' }}>
              Llegada
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: '#1a1208', fontFamily: 'var(--font-body)' }}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Calendar size={20} style={{ color: 'var(--forest-mid)', flexShrink: 0 }} />
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-0.5" style={{ color: 'var(--forest)' }}>
              Salida
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: '#1a1208', fontFamily: 'var(--font-body)' }}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-3 px-5 py-3">
          <Users size={20} style={{ color: 'var(--forest-mid)', flexShrink: 0 }} />
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-0.5" style={{ color: 'var(--forest)' }}>
              Huéspedes
            </label>
            <select
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: '#1a1208', fontFamily: 'var(--font-body)' }}
            >
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center justify-center px-4s py-3">
          <button
            onClick={handleSearch}
            className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap"
          >
            <Search size={16} />
            <span>Buscar</span>
          </button>
        </div>

      </div>
    </div>
  )
}
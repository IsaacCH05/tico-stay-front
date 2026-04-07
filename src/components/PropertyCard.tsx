import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, MapPin, Users, Bed, Leaf } from 'lucide-react'
import type { Property } from '../data/properties'

interface PropertyCardProps {
  property: Property
  compact?: boolean
}

export default function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [imgError, setImgError] = useState(false)

  const fallback = `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80`

  const typeLabel: Record<Property['type'], string> = {
    hotel: 'Hotel',
    'eco-lodge': 'Eco-Lodge',
    villa: 'Villa',
    cabaña: 'Cabaña',
    apartamento: 'Apartamento',
  }

  return (
    <article
      className="card-hover rounded-[var(--radius-lg)] overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: compact ? '3/2' : '4/3' }}>
        <img
          src={imgError ? fallback : property.image}
          alt={property.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ display: 'block' }}
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge badge-earth" style={{ backdropFilter: 'blur(8px)' }}>
            {typeLabel[property.type]}
          </span>
          {property.ecoFriendly && (
            <span className="badge badge-green" style={{ backdropFilter: 'blur(8px)' }}>
              <Leaf size={10} /> Eco
            </span>
          )}
        </div>
        {/* Wishlist button */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: wishlisted ? 'var(--earth-mid)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
          }}
          aria-label="Favorito"
        >
          <Heart
            size={15}
            fill={wishlisted ? 'white' : 'none'}
            stroke={wishlisted ? 'white' : 'var(--text-muted)'}
          />
        </button>
        {/* Price overlay */}
        <div
          className="absolute bottom-3 right-3 rounded-[var(--radius-md)] px-3 py-1.5"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-white text-xs font-400">desde </span>
          <span className="text-white text-base font-bold">${property.price}</span>
          <span className="text-white/70 text-xs">/noche</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-semibold text-base leading-snug line-clamp-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {property.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} fill="var(--gold)" stroke="none" />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {property.rating}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ({property.reviewCount})
            </span>
          </div>
        </div>

        <p className="flex items-center gap-1 text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          <MapPin size={12} />
          {property.location}
        </p>

        {!compact && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {property.description}
          </p>
        )}

        {/* Specs */}
        <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1 text-xs">
            <Users size={12} /> {property.maxGuests} huéspedes
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Bed size={12} /> {property.bedrooms} {property.bedrooms === 1 ? 'hab' : 'habs'}
          </span>
        </div>

        {/* Amenities */}
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.amenities.slice(0, 3).map(a => (
              <span
                key={a}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
              >
                {a}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
              >
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <Link
          to={`/propiedad/${property.id}`}
          className="btn-primary w-full justify-center text-sm py-2.5"
        >
          Ver detalles
        </Link>
      </div>
    </article>
  )
}

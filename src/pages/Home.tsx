import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Award, Shield, Clock, ChevronRight, MapPin } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import api from '../api'
import { REGIONS, type Property } from '../data/properties'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=1600&q=85',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=85',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=85',
]

const REGION_IMAGES: Record<string, string> = {
  'Guanacaste':       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  'Caribe':           'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
  'Pacífico Central': 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=600&q=80',
  'Zona Sur':         'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  'Alajuela':         'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
  'San José':         'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80',
}

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [properties, setProperties] = useState<Property[]>([])
  const featured = properties.filter(p => p.featured).slice(0, 3)

  useEffect(() => {
    api.get<Property[]>('/properties').then(res => setProperties(res.data)).catch(console.error);
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background slideshow */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,25,15,0.55) 0%, rgba(10,25,15,0.35) 50%, rgba(10,25,15,0.75) 100%)',
          }}
        />

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="rounded-full transition-all"
              style={{
                width: i === heroIdx ? '24px' : '8px',
                height: '8px',
                background: i === heroIdx ? 'var(--forest-light)' : 'rgba(255,255,255,0.4)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="container relative z-10 text-center pt-24 pb-32">
          <div className="opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
            <span className="badge badge-green mb-6 inline-flex" style={{ background: 'rgba(82,183,136,0.25)', color: 'var(--forest-pale)' }}>
              <Leaf size={12} /> Pura Vida · Costa Rica
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 opacity-0 animate-fade-up delay-100"
            style={{ fontFamily: 'var(--font-display)', animationFillMode: 'forwards' }}
          >
            Tu refugio
            <br />
            <span className="italic" style={{ color: 'var(--forest-pale)' }}>costarricense</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up delay-200"
            style={{ color: 'rgba(255,255,255,0.8)', animationFillMode: 'forwards' }}
          >
            Desde eco-lodges con vista al volcán hasta villas caribeñas. 
            Descubre alojamientos únicos en el país de la biodiversidad.
          </p>

          {/* Search bar */}
          <div className="opacity-0 animate-fade-up delay-300" style={{
            animationFillMode: 'forwards',
            maxWidth: '860px',
            margin: '0 auto',
            padding: '0 1rem',
          }}>
            <SearchBar />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 opacity-0 animate-fade-up delay-400" style={{ animationFillMode: 'forwards' }}>
            {['Eco-Lodges', 'Playa', 'Volcanes', 'Selva', 'Surf'].map(tag => (
              <Link
                key={tag}
                to={`/propiedades?q=${tag.toLowerCase()}`}
                className="text-sm px-4 py-1.5 rounded-full transition-all"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Propiedades únicas', icon: '🏡' },
              { value: '50K+', label: 'Viajeros felices', icon: '😊' },
              { value: '7',    label: 'Regiones de CR',   icon: '🗺️' },
              { value: '4.8★', label: 'Calificación media', icon: '⭐' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured properties ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Selección especial
              </p>
              <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Propiedades destacadas
              </h2>
            </div>
            <Link to="/propiedades" className="btn-secondary hidden sm:flex">
              Ver todas <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}> 

          {featured.map((p, i) => (
              <div
                key={p.id}
                className="opacity-0 animate-fade-up"
                style={{ animationFillMode: 'forwards', animationDelay: `${i * 0.1}s` }}
              >
                <PropertyCard property={p} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/propiedades" className="btn-secondary">
              Ver todas las propiedades <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Regions ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Explora el país
            </p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Regiones de Costa Rica
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {REGIONS.slice(0, 6).map((region, i) => (
              <Link
                key={region}
                to={`/propiedades?region=${encodeURIComponent(region)}`}
                className={`relative overflow-hidden rounded-[var(--radius-lg)] group cursor-pointer no-underline ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 ? 'auto' : '4/3', minHeight: i === 0 ? '320px' : 'auto' }}
              >
                <img
                  src={REGION_IMAGES[region] ?? HERO_IMAGES[0]}
                  alt={region}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(10,25,15,0.8) 0%, rgba(10,25,15,0.1) 60%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <MapPin size={11} />
                    {properties.filter(p => p.region === region).length} propiedades
                  </p>
                  <h3
                    className="text-white font-bold"
                    style={{ fontFamily: 'var(--font-display)', fontSize: i === 0 ? '1.75rem' : '1.125rem' }}
                  >
                    {region}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why TicoStay ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              ¿Por qué TicoStay?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf size={24} />,
                title: 'Turismo sostenible',
                desc: 'Filtramos propiedades con certificación CST y prácticas eco-amigables.',
                color: 'var(--forest-light)',
              },
              {
                icon: <Award size={24} />,
                title: 'Propiedades verificadas',
                desc: 'Cada alojamiento es revisado por nuestro equipo antes de publicarse.',
                color: 'var(--gold)',
              },
              {
                icon: <Shield size={24} />,
                title: 'Reserva segura',
                desc: 'Pagos protegidos y política de cancelación flexible en todas las reservas.',
                color: 'var(--turquoise-mid)',
              },
              {
                icon: <Clock size={24} />,
                title: 'Soporte 24/7',
                desc: 'Equipo costarricense disponible para ayudarte antes, durante y después.',
                color: 'var(--earth-light)',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="p-6 rounded-[var(--radius-lg)] text-center opacity-0 animate-fade-up"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  animationFillMode: 'forwards',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${item.color}22`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div
            className="relative overflow-hidden rounded-[var(--radius-xl)] p-10 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: 'var(--forest-light)' }} />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-10" style={{ background: 'var(--gold)' }} />

            <div className="relative z-10">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--forest-pale)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ¿Tienes una propiedad?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Únete a la comunidad TicoStay
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">
                Publica tu hotel, eco-lodge o villa y llega a miles de viajeros que buscan experiencias auténticas en Costa Rica.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/registrarse"
                  className="btn-primary py-3 px-8"
                  style={{ background: 'white', color: 'var(--forest)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--forest-pale)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  Publicar mi propiedad
                </Link>
                <Link to="/iniciar-sesion" className="btn-secondary py-3 px-8" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                  Saber más <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

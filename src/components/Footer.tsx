import { Link } from 'react-router-dom'
import { Leaf, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--forest)', color: 'rgba(255,255,255,0.85)' }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <div className="w-9 h-9 rounded-lg bg-[var(--forest-light)] flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'white' }}>
                Tico<span style={{ color: 'var(--forest-pale)' }}>Stay</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Descubre la magia de Costa Rica. Hoteles, eco-lodges y alquileres vacacionales únicos en el país de la Pura Vida.
            </p>
            <div className="flex gap-3">
              {[
  { href: '#', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { href: '#', label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { href: '#', label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
].map(({ href, label, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--forest-light)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
              Explorar
            </h4>
            <ul className="flex flex-col gap-2">
              {['Todas las propiedades', 'Eco-lodges', 'Hoteles boutique', 'Villas privadas', 'Ofertas especiales'].map(item => (
                <li key={item}>
                  <Link
                    to="/propiedades"
                    className="text-sm transition-colors no-underline"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--forest-pale)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
              Regiones
            </h4>
            <ul className="flex flex-col gap-2">
              {['Guanacaste', 'Caribe', 'Pacífico Central', 'Zona Sur', 'Valle Central'].map(r => (
                <li key={r}>
                  <Link
                    to={`/propiedades?region=${r}`}
                    className="text-sm transition-colors no-underline"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--forest-pale)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
              Contacto
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { Icon: MapPin, text: 'San José, Costa Rica' },
                { Icon: Mail, text: 'hola@ticostay.cr' },
                { Icon: Phone, text: '+506 2222-3333' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <Icon size={14} style={{ color: 'var(--forest-light)', flexShrink: 0 }} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
        >
          <p>© {new Date().getFullYear()} TicoStay. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            {['Privacidad', 'Términos', 'Cookies'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

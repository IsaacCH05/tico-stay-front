import { Link } from 'react-router-dom'
import { Leaf, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react'

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
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--forest-light)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                >
                  <Icon size={16} />
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

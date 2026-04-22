import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X, Leaf, LogOut, Settings, ChevronDown, CalendarDays } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s ease',
        background: isTransparent ? 'transparent' : 'var(--bg-card)',
        boxShadow: isTransparent ? 'none' : 'var(--shadow-md)',
        borderBottom: isTransparent ? 'none' : '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--forest-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={16} color="white" />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700,
                color: isTransparent ? 'white' : 'var(--text-primary)',
              }}>
                Tico<span style={{ color: 'var(--forest-light)' }}>Stay</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="ts-desktop" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Propiedades', to: '/propiedades' },
                { label: 'Regiones', to: '/propiedades?region=all' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '7px 14px', borderRadius: '8px',
                  fontSize: '0.9rem', fontWeight: 500,
                  color: isTransparent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
                  textDecoration: 'none', transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = isTransparent ? 'rgba(255,255,255,0.12)' : 'var(--bg-subtle)'
                    e.currentTarget.style.color = isTransparent ? 'white' : 'var(--text-primary)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = isTransparent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right side */}
            <div className="ts-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Theme toggle */}
              <button onClick={toggleTheme} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '8px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: isTransparent ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = isTransparent ? 'rgba(255,255,255,0.1)' : 'var(--bg-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isAuthenticated && user ? (
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 10px', borderRadius: '8px', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: isTransparent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = isTransparent ? 'rgba(255,255,255,0.1)' : 'var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'var(--forest-mid)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '0.8rem', fontWeight: 700,
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={13} style={{
                      transition: 'transform 0.2s',
                      transform: userMenuOpen ? 'rotate(180deg)' : 'none',
                    }} />
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      width: '200px', background: 'var(--bg-card)',
                      border: '1px solid var(--border)', borderRadius: '12px',
                      boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
                    }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                      </div>
                      <Link to="/mis-reservas" onClick={() => setUserMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 14px', fontSize: '0.875rem',
                        color: 'var(--text-secondary)', textDecoration: 'none',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)' }}
                      >
                        <CalendarDays size={14} /> Mis reservas
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '9px 14px', fontSize: '0.875rem',
                          color: 'var(--text-secondary)', textDecoration: 'none',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--accent)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)' }}
                        >
                          <Settings size={14} /> Panel Admin
                        </Link>
                      )}
                      <button onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 14px', fontSize: '0.875rem', color: '#ef4444',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <LogOut size={14} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link to="/iniciar-sesion" style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '8px 12px', borderRadius: '8px',
                    fontSize: '0.875rem', fontWeight: 500,
                    color: isTransparent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
                    textDecoration: 'none', transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = isTransparent ? 'rgba(255,255,255,0.1)' : 'var(--bg-subtle)'; e.currentTarget.style.color = isTransparent ? 'white' : 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isTransparent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}
                  >
                    Iniciar sesión
                  </Link>
                  <Link to="/registrarse" style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '8px 20px', background: 'var(--accent)', color: 'var(--accent-fg)',
                    borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none' }}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button className="ts-mobile" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: 'none', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '8px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: isTransparent ? 'white' : 'var(--text-primary)',
            }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
            <div style={{
              maxWidth: '1280px', margin: '0 auto',
              padding: '12px 1.5rem', display: 'flex', flexDirection: 'column', gap: '2px',
            }}>
              {[{ label: 'Inicio', to: '/' }, { label: 'Propiedades', to: '/propiedades' }].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
                  padding: '10px 12px', borderRadius: '8px',
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                }}>
                  {l.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0' }} />
              <button onClick={() => { toggleTheme(); setMenuOpen(false) }} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', borderRadius: '8px', border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              }}>
                {theme === 'dark' ? <><Sun size={16} /> Modo claro</> : <><Moon size={16} /> Modo oscuro</>}
              </button>
              {isAuthenticated ? (
                <>
                  <Link to="/mis-reservas" onClick={() => setMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', borderRadius: '8px',
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  }}>
                    <CalendarDays size={16} /> Mis reservas
                  </Link>
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', borderRadius: '8px', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: '#ef4444', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  }}>
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/iniciar-sesion" onClick={() => setMenuOpen(false)} style={{
                    padding: '10px 12px', borderRadius: '8px',
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  }}>
                    Iniciar sesión
                  </Link>
                  <Link to="/registrarse" onClick={() => setMenuOpen(false)} style={{
                    display: 'flex', justifyContent: 'center',
                    padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-fg)',
                    borderRadius: '9999px', fontWeight: 600, textDecoration: 'none',
                    marginTop: '4px', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  }}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Breakpoints para clases ts-desktop / ts-mobile */}
      <style>{`
        @media (max-width: 767px) {
          .ts-desktop { display: none !important; }
          .ts-mobile  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X, Leaf, User, LogOut, Settings, ChevronDown } from 'lucide-react'
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

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-[var(--bg-card)] shadow-[var(--shadow-md)] border-b border-[var(--border)]'

  const textColor = isHome && !scrolled ? 'text-white' : 'text-[var(--text-primary)]'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-[var(--forest-light)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf size={16} className="text-white" />
            </div>
            <span
              className="font-display text-xl font-bold leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: isHome && !scrolled ? 'white' : 'var(--text-primary)',
              }}
            >
              Tico<span style={{ color: 'var(--forest-light)' }}>Stay</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Inicio', to: '/' },
              { label: 'Propiedades', to: '/propiedades' },
              { label: 'Regiones', to: '/propiedades?region=all' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`btn-ghost text-sm font-medium ${
                  isHome && !scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`btn-ghost p-2 ${isHome && !scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 btn-ghost ${isHome && !scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--forest-mid)] flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 animate-scale-in">
                    <div className="px-4 py-2 border-b border-[var(--border)]">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent)] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={14} /> Panel Admin
                      </Link>
                    )}
                    <Link
                      to="/perfil"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={14} /> Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/iniciar-sesion"
                  className={`btn-ghost text-sm ${isHome && !scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
                >
                  Iniciar sesión
                </Link>
                <Link to="/registrarse" className="btn-primary text-sm py-2 px-4">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className={`md:hidden btn-ghost p-2 ${isHome && !scrolled ? 'text-white hover:bg-white/10' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg-card)] border-t border-[var(--border)] animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {[
              { label: 'Inicio', to: '/' },
              { label: 'Propiedades', to: '/propiedades' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="btn-ghost justify-start"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border)] my-2" />
            <button onClick={toggleTheme} className="btn-ghost justify-start gap-2">
              {theme === 'dark' ? <><Sun size={16} /> Modo claro</> : <><Moon size={16} /> Modo oscuro</>}
            </button>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-ghost justify-start gap-2 text-red-500">
                <LogOut size={16} /> Cerrar sesión
              </button>
            ) : (
              <>
                <Link to="/iniciar-sesion" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link to="/registrarse" className="btn-primary justify-start mt-1" onClick={() => setMenuOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

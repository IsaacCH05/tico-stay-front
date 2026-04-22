import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (role: 'user' | 'admin') => {
    setLoading(true)
    try {
      const e = role === 'admin' ? 'admin@ticostay.cr' : 'user@ticostay.cr'
      await login(e, '123456')
      navigate(role === 'admin' ? '/admin' : '/')
    } catch {
      setError('Error en demo login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorativo */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, var(--forest) 0%, var(--forest-mid) 100%)' }}
      >
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.2 }}
        />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
            <Leaf size={32} style={{ color: 'var(--forest-pale)' }} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Tico<span style={{ color: 'var(--forest-pale)' }}>Stay</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            El lugar donde la Pura Vida se convierte en tu próxima aventura.
          </p>
          <div
            className="mt-10 p-6 rounded-[var(--radius-xl)]"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="text-white/80 italic" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              "Más de 500 propiedades únicas te esperan en toda Costa Rica."
            </p>
          </div>
        </div>
      </div>

      {/* Right — formulario */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ background: 'var(--bg)' }}
      >
        <div className="w-full max-w-md animate-scale-in">
          {/* Logo mobile */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden no-underline">
            <div className="w-8 h-8 rounded-lg bg-[var(--forest-light)] flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Tico<span style={{ color: 'var(--forest-light)' }}>Stay</span>
            </span>
          </Link>

          <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Bienvenido de vuelta
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Ingresa a tu cuenta para gestionar reservas y explorar propiedades.
          </p>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] mb-5 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Contraseña
                </label>
                <a href="#" className="text-sm no-underline" style={{ color: 'var(--accent)' }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Demo rápido */}
          <div className="mt-6">
            <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>
              ─── Demo rápido ───
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLogin('user')}
                disabled={loading}
                className="btn-secondary text-sm py-2.5"
              >
                Ingresar como Huésped
              </button>
              <button
                onClick={() => quickLogin('admin')}
                disabled={loading}
                className="btn-secondary text-sm py-2.5"
                style={{ borderColor: 'var(--forest-light)', color: 'var(--forest-light)' }}
              >
                Ingresar como Admin
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registrarse" className="font-semibold no-underline" style={{ color: 'var(--accent)' }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
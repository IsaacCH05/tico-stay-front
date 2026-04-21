import { Link } from 'react-router-dom'
import { Leaf, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--forest-light)]/20 flex items-center justify-center mx-auto mb-6">
        <Leaf size={28} style={{ color: 'var(--forest-light)' }} />
      </div>
      <h1
        className="text-7xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
      >
        404
      </h1>
      <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        Página no encontrada
      </h2>
      <p className="mb-8 max-w-sm" style={{ color: 'var(--text-muted)' }}>
        Parece que esta página se perdió en la selva costarricense. Vuelve al inicio para seguir explorando.
      </p>
      <Link to="/" className="btn-primary">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>
    </div>
  )
}

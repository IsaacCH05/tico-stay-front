import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Check, Home, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const REGIONS_LIST = ['San José','Guanacaste','Caribe','Pacífico Central','Zona Sur','Alajuela','Heredia']
const TYPES_LIST = ['hotel','eco-lodge','villa','cabaña','apartamento']

export default function SubmitProperty() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', type: 'villa', location: '', region: 'Guanacaste',
    price: '', image: '', description: '', maxGuests: '2',
    bedrooms: '1', bathrooms: '1', amenities: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/iniciar-sesion')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/properties', {
        ...form,
        price: Number(form.price),
        maxGuests: Number(form.maxGuests),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: [form.image]
      })
      setSuccess(true)
    } catch (err) {
      setError('Hubo un error al enviar la solicitud. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main style={{ paddingTop: '4rem', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container py-16 flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--forest-light)' }}>
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>¡Solicitud enviada!</h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Tu propiedad está siendo revisada por nuestro equipo. Te notificaremos cuando sea aprobada y publicada.</p>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '4rem', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container py-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Publica tu propiedad</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Llena el siguiente formulario para enviar tu solicitud de publicación.</p>

        {!isAuthenticated && (
          <div className="flex items-center gap-2 p-4 rounded-[var(--radius-md)] mb-6 text-sm" style={{ background: 'rgba(233,196,106,0.15)', color: 'var(--gold-dark)' }}>
            <AlertCircle size={18} /> Debes <Link to="/iniciar-sesion" className="font-bold underline ml-1">iniciar sesión</Link> para poder enviar una propiedad.
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-[var(--radius-xl)] p-6 md:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {error && <div className="p-3 rounded-md mb-4 text-sm bg-red-50 text-red-500 border border-red-200">{error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Nombre del alojamiento *</label>
              <input required className="input-field" value={form.name} onChange={f('name')} placeholder="Ej: Villa Paraíso" disabled={!isAuthenticated}/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Tipo *</label>
              <select className="input-field" value={form.type} onChange={f('type')} disabled={!isAuthenticated}>
                {TYPES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Región *</label>
              <select className="input-field" value={form.region} onChange={f('region')} disabled={!isAuthenticated}>
                {REGIONS_LIST.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Ubicación *</label>
              <input required className="input-field" value={form.location} onChange={f('location')} placeholder="Ej: Tamarindo" disabled={!isAuthenticated}/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Precio/noche (USD) *</label>
              <input required type="number" className="input-field" value={form.price} onChange={f('price')} placeholder="100" min="1" disabled={!isAuthenticated}/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>URL de la imagen principal *</label>
              <input required className="input-field" value={form.image} onChange={f('image')} placeholder="https://..." disabled={!isAuthenticated}/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
              <textarea required className="input-field" value={form.description} onChange={f('description')} rows={3} disabled={!isAuthenticated} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Huéspedes</label>
              <input type="number" className="input-field" value={form.maxGuests} onChange={f('maxGuests')} min="1" disabled={!isAuthenticated}/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Habitaciones</label>
              <input type="number" className="input-field" value={form.bedrooms} onChange={f('bedrooms')} min="1" disabled={!isAuthenticated}/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Amenidades (separadas por coma)</label>
              <input className="input-field" value={form.amenities} onChange={f('amenities')} placeholder="Piscina, Wi-Fi, Parqueo" disabled={!isAuthenticated}/>
            </div>
          </div>

          <button type="submit" disabled={!isAuthenticated || loading} className="btn-primary w-full justify-center py-3 mt-8">
            <Home size={18} className="mr-2" /> {loading ? 'Enviando...' : 'Enviar solicitud de propiedad'}
          </button>
        </form>
      </div>
    </main>
  )
}
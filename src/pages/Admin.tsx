import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Home, PlusCircle, Star, Settings, LogOut, Menu, X,
  TrendingUp, Calendar, DollarSign, Eye, Edit2, Trash2, CheckCircle,
  XCircle, Clock, Leaf, MoreVertical, Bell, X as XIcon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBookings, type Booking } from '../context/BookingContext'
import { PROPERTIES, type Property } from '../data/properties'
import api from '../api'

type AdminTab = 'overview' | 'properties' | 'bookings' | 'reviews' | 'settings'

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',    label: 'Resumen',       icon: <LayoutDashboard size={18} /> },
  { id: 'properties',  label: 'Propiedades',   icon: <Home size={18} /> },
  { id: 'bookings',    label: 'Reservas',      icon: <Calendar size={18} /> },
  { id: 'reviews',     label: 'Reseñas',       icon: <Star size={18} /> },
  { id: 'settings',    label: 'Configuración', icon: <Settings size={18} /> },
]

type ReviewItem = { id: string; guest: string; property: string; rating: number; comment: string; date: string; approved: boolean }

function mapApiReview(raw: Record<string, unknown>): ReviewItem {
  return {
    id:       (raw._id ?? raw.id) as string,
    guest:    raw.guestName as string,
    property: raw.propertyName as string,
    rating:   raw.rating as number,
    comment:  raw.comment as string,
    date:     new Date((raw.createdAt ?? raw.date) as string).toISOString().split('T')[0],
    approved: raw.approved as boolean,
  }
}

function StatusBadge({ status }: { status: string }) {
  const MAP: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    confirmed: { label: 'Confirmada', color: 'var(--forest-light)', bg: 'rgba(82,183,136,0.12)', icon: <CheckCircle size={11} /> },
    pending:   { label: 'Pendiente',  color: 'var(--gold-dark)',    bg: 'rgba(233,196,106,0.15)', icon: <Clock size={11} /> },
    cancelled: { label: 'Cancelada',  color: '#ef4444',             bg: 'rgba(239,68,68,0.1)',   icon: <XCircle size={11} /> },
  }
  const s = MAP[status] ?? MAP['pending']
  return (
    <span className="badge" style={{ color: s.color, background: s.bg }}>
      {s.icon} {s.label}
    </span>
  )
}

/* ── Sub-tabs ── */
function OverviewTab({ realStats, recentBookings, pendingReviewsCount }: {
  realStats: { totalProperties: number; activeBookings: number; monthlyRevenue: number; occupancyRate: number }
  recentBookings: Booking[]
  pendingReviewsCount: number
}) {
  const pendingReviews = pendingReviewsCount
  const stats = [
    { label: 'Propiedades activas', value: realStats.totalProperties,                       icon: <Home size={20} />,         color: 'var(--forest-light)', change: '+3 este mes' },
    { label: 'Reservas activas',    value: realStats.activeBookings,                        icon: <Calendar size={20} />,     color: 'var(--turquoise-mid)', change: '+12% vs mes anterior' },
    { label: 'Ingresos del mes',    value: `$${realStats.monthlyRevenue.toLocaleString()}`, icon: <DollarSign size={20} />,   color: 'var(--gold)',          change: '+8% vs mes anterior' },
    { label: 'Tasa de ocupación',   value: `${realStats.occupancyRate}%`,                   icon: <TrendingUp size={20} />,   color: 'var(--earth-light)',   change: '↑ 5pts vs mes anterior' },
  ]
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
            <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.value}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--forest-light)' }}>{s.change}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[var(--radius-lg)] p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Reservas recientes</h3>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay reservas aún.</p>
            ) : recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--bg-subtle)', color: 'var(--accent)' }}>{b.userName?.charAt(0) ?? '?'}</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.userName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.propertyName}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${b.total}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Reseñas pendientes
            <span className="ml-2 badge badge-gold">{pendingReviews}</span>
          </h3>
          <div className="space-y-3">
            {pendingReviews === 0 && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay reseñas pendientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type PropForm = {
  name: string; type: Property['type']; location: string; region: string
  price: string; image: string; description: string; maxGuests: string
  bedrooms: string; bathrooms: string; amenities: string
  ecoFriendly: boolean; featured: boolean
}
const EMPTY_FORM: PropForm = {
  name: '', type: 'hotel', location: '', region: 'San José',
  price: '', image: '', description: '', maxGuests: '2',
  bedrooms: '1', bathrooms: '1', amenities: '',
  ecoFriendly: false, featured: false,
}
const REGIONS_LIST = ['San José','Guanacaste','Caribe','Pacífico Central','Zona Sur','Alajuela','Heredia']
const TYPES_LIST: Property['type'][] = ['hotel','eco-lodge','villa','cabaña','apartamento']

function mapApiProperty(raw: Record<string, unknown>): Property & { status?: string } 
{  return {
    id:          (raw._id ?? raw.id) as string,
    name:        raw.name as string,
    type:        raw.type as Property['type'],
    location:    raw.location as string,
    region:      raw.region as string,
    price:       raw.price as number,
    rating:      (raw.rating ?? 0) as number,
    reviewCount: (raw.reviewCount ?? 0) as number,
    image:       raw.image as string,
    images:      (raw.images ?? []) as string[],
    amenities:   (raw.amenities ?? []) as string[],
    description: (raw.description ?? '') as string,
    featured:    (raw.featured ?? false) as boolean,
    ecoFriendly: (raw.ecoFriendly ?? false) as boolean,
    maxGuests:   (raw.maxGuests ?? 1) as number,
    bedrooms:    (raw.bedrooms ?? 1) as number,
    bathrooms:   (raw.bathrooms ?? 1) as number,
    status:      (raw.status ?? 'approved') as string,
  }
}

function PropertiesTab() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProps, setLoadingProps] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [form, setForm] = useState<PropForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    api.get('/properties')
      .then(res => setProperties(res.data.map(mapApiProperty)))
      .catch(() => setProperties(PROPERTIES))
      .finally(() => setLoadingProps(false))
  }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(''); setShowForm(true) }
  const openEdit   = (p: Property) => {
    setEditing(p)
    setForm({
      name: p.name, type: p.type, location: p.location, region: p.region,
      price: String(p.price), image: p.image, description: p.description,
      maxGuests: String(p.maxGuests), bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms), amenities: p.amenities.join(', '),
      ecoFriendly: p.ecoFriendly, featured: p.featured,
    })
    setFormError('')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.location || !form.price || !form.image) {
      setFormError('Nombre, ubicación, precio e imagen son obligatorios.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const body = {
        name: form.name, type: form.type, location: form.location, region: form.region,
        price: Number(form.price), image: form.image, description: form.description,
        maxGuests: Number(form.maxGuests), bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        ecoFriendly: form.ecoFriendly, featured: form.featured,
        images: [form.image],
      }
      if (editing) {
        const res = await api.put(`/properties/${editing.id}`, body)
        setProperties(prev => prev.map(p => p.id === editing.id ? mapApiProperty(res.data) : p))
      } else {
        const res = await api.post('/properties', body)
        setProperties(prev => [mapApiProperty(res.data), ...prev])
      }
      setShowForm(false)
    } catch (error) {
      setFormError('Error al guardar. Verifica los datos e intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (p: Property) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/properties/${p.id}`)
      setProperties(prev => prev.filter(x => x.id !== p.id))
    } catch {
      alert('No se pudo eliminar la propiedad.')
    }
  }

  const f = (k: keyof PropForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Modal crear/editar */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowForm(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[var(--radius-xl)] p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {editing ? 'Editar propiedad' : 'Nueva propiedad'}
              </h2>
              <button onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-[var(--radius-md)] mb-4 text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Nombre *</label>
                <input className="input-field w-full" value={form.name} onChange={f('name')} placeholder="Ej: Nayara Springs" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Tipo *</label>
                <select className="input-field w-full" value={form.type} onChange={f('type')}>
                  {TYPES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Región *</label>
                <select className="input-field w-full" value={form.region} onChange={f('region')}>
                  {REGIONS_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Ubicación *</label>
                <input className="input-field w-full" value={form.location} onChange={f('location')} placeholder="Ej: La Fortuna, Alajuela" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Precio/noche (USD) *</label>
                <input type="number" className="input-field w-full" value={form.price} onChange={f('price')} placeholder="Ej: 150" min="1" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>URL de imagen principal *</label>
                <input className="input-field w-full" value={form.image} onChange={f('image')} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
                <textarea className="input-field w-full" value={form.description} onChange={f('description')}
                  placeholder="Descripción del alojamiento..." rows={3}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Máx. huéspedes</label>
                <input type="number" className="input-field w-full" value={form.maxGuests} onChange={f('maxGuests')} min="1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Habitaciones</label>
                <input type="number" className="input-field w-full" value={form.bedrooms} onChange={f('bedrooms')} min="1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Baños</label>
                <input type="number" className="input-field w-full" value={form.bathrooms} onChange={f('bathrooms')} min="1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Amenidades (separadas por coma)</label>
                <input className="input-field w-full" value={form.amenities} onChange={f('amenities')} placeholder="Piscina, Wi-Fi, Spa" />
              </div>
              <div className="sm:col-span-2 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form.ecoFriendly}
                    onChange={e => setForm(p => ({ ...p, ecoFriendly: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--accent)]" />
                  🌿 Eco-friendly
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--accent)]" />
                  ⭐ Destacada
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center py-2.5">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5"
                style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear propiedad'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="relative">
            <input type="text" placeholder="Buscar propiedad..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm" style={{ width: '260px' }} />
            <Eye size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
          <button onClick={openCreate} className="btn-primary text-sm py-2">
            <PlusCircle size={15} /> Agregar propiedad
          </button>
        </div>

        {loadingProps ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Cargando propiedades…</div>
        ) : (
          <div className="rounded-[var(--radius-lg)] overflow-auto border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
                  {['Propiedad','Tipo','Ubicación','Precio/noche','Rating','Estado',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap"
                      style={{ color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b transition-colors" style={{ borderColor: 'var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-[var(--radius-md)] object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                          {p.ecoFriendly && <span className="text-xs" style={{ color: 'var(--forest-light)' }}>🌿 Eco</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="badge badge-earth text-xs">{p.type}</span></td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.region}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${p.price}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm">
                        <span style={{ color: 'var(--gold)' }}>★</span>
                        <span style={{ color: 'var(--text-primary)' }}>{p.rating}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(p as any).status === 'pending' ? (
                         <span className="badge badge-gold text-xs">Pendiente</span>
                      ) : (
                         <span className="badge badge-green text-xs">Activa</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Botón rápido para aprobar si está pendiente */}
                        {(p as any).status === 'pending' && (
                          <button 
                            onClick={async () => {
                              await api.put(`/properties/${p.id}`, { status: 'approved' });
                              setProperties(prev => prev.map(x => x.id === p.id ? { ...x, status: 'approved' } : x));
                            }} 
                            className="btn-primary text-xs py-1 px-2" style={{ background: 'var(--forest-light)' }} title="Aprobar">
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button onClick={() => openEdit(p)} className="btn-ghost p-1.5" title="Editar"><Edit2 size={14} /></button>
                        <button onClick={() => navigate(`/propiedad/${p.id}`)} className="btn-ghost p-1.5" title="Ver"><Eye size={14} /></button>
                        <button onClick={() => handleDelete(p)} className="btn-ghost p-1.5" style={{ color: '#ef4444' }} title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No se encontraron propiedades.</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function BookingsTab({
  bookings,
  onUpdateStatus,
}: {
  bookings: Booking[]
  onUpdateStatus: (id: string, status: Booking['status']) => void
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Reservas</h2>
      <div className="rounded-[var(--radius-lg)] overflow-auto border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
              {['ID','Huésped','Propiedad','Check-in','Check-out','Total','Estado','Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No hay reservas aún.
                </td>
              </tr>
            ) : bookings.map(b => (
              <tr key={b.id} className="border-b transition-colors" style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{b.id}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.userName}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.propertyName}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.checkIn}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.checkOut}</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${b.total}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  {b.status === 'pending' ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateStatus(b.id, 'confirmed')}
                        className="btn-primary text-xs py-1 px-2"
                        style={{ background: 'var(--forest-light)' }}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => onUpdateStatus(b.id, 'cancelled')}
                        className="btn-secondary text-xs py-1 px-2"
                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button className="btn-ghost p-1.5"><MoreVertical size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReviewsTab({ reviews, onApprove, onReject }: {
  reviews: ReviewItem[]
  onApprove: (id: string) => void
  onReject:  (id: string) => void
}) {
  const approve = onApprove
  const reject  = onReject
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Reseñas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(r => (
          <div key={r.id} className="rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--bg-card)', border: `1px solid ${r.approved ? 'var(--border)' : 'rgba(233,196,106,0.3)'}`, boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.guest}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.property} · {r.date}</p>
              </div>
              <span style={{ color: 'var(--gold)', fontSize: '0.875rem' }}>{'★'.repeat(r.rating)}</span>
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
            <div className="flex items-center justify-between">
              {r.approved ? (
                <span className="badge badge-green"><CheckCircle size={11} /> Aprobada</span>
              ) : (
                <span className="badge badge-gold"><Clock size={11} /> Pendiente</span>
              )}
              {!r.approved && (
                <div className="flex gap-2">
                  <button onClick={() => approve(r.id)} className="btn-primary text-xs py-1.5 px-3"><CheckCircle size={12} /> Aprobar</button>
                  <button onClick={() => reject(r.id)} className="btn-secondary text-xs py-1.5 px-3" style={{ borderColor: '#ef4444', color: '#ef4444' }}><XCircle size={12} /> Rechazar</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Configuración</h2>
      <div className="rounded-[var(--radius-lg)] p-6 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Información del sitio</h3>
        <div className="grid grid-cols-1 gap-4">
          {[{ label: 'Nombre del sitio', value: 'TicoStay' }, { label: 'Email de contacto', value: 'hola@ticostay.cr' }, { label: 'Teléfono', value: '+506 2222-3333' }].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
              <input type="text" defaultValue={f.value} className="input-field" />
            </div>
          ))}
        </div>
        <button className="btn-primary mt-5 text-sm py-2">Guardar cambios</button>
      </div>
      <div className="rounded-[var(--radius-lg)] p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notificaciones</h3>
        {['Nueva reserva', 'Reseña pendiente', 'Nueva propiedad registrada', 'Cancelación de reserva'].map(item => (
          <label key={item} className="flex items-center justify-between py-3 border-b last:border-0 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--accent)]" />
          </label>
        ))}
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { bookings, updateBookingStatus, notifications, unreadCount, markAllRead, markOneRead } = useBookings()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  
  const [totalPropsDb, setTotalPropsDb] = useState(PROPERTIES.length)

  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get('/properties')
      .then(res => setTotalPropsDb(res.data.length))
      .catch(err => console.error('Error cargando total de propiedades:', err))
  }, [])

  // Cargar reseñas desde la API
  useEffect(() => {
    api.get('/reviews')
      .then(res => setReviews(res.data.map(mapApiReview)))
      .catch(err => console.error('Error loading reviews:', err))
  }, [])

  const approveReview = async (id: string) => {
    await api.put(`/reviews/${id}`, { approved: true })
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r))
  }

  const rejectReview = async (id: string) => {
    await api.delete(`/reviews/${id}`)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const monthlyRevenue    = confirmedBookings.reduce((s, b) => s + b.total, 0)
  
  // ACTUALIZADO: Pasamos la variable dinámica en vez de la estática
  const realStats = {
    totalProperties: totalPropsDb, 
    activeBookings:  confirmedBookings.length,
    monthlyRevenue,
    occupancyRate:   bookings.length > 0 ? Math.round((confirmedBookings.length / bookings.length) * 100) : 0,
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }
  const pendingReviews = reviews.filter(r => !r.approved).length

  const fmtNotif = (d: string) =>
    new Date(d).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)} />}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col w-64 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--forest)', height: '100vh', boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--forest-light)' }}>
              <Leaf size={16} className="text-white" />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', color: 'white', fontWeight: 700, lineHeight: 1, fontSize: '1rem' }}>
                Tico<span style={{ color: 'var(--forest-pale)' }}>Stay</span>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--forest-light)', color: 'white' }}>{user?.name.charAt(0) ?? 'A'}</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'white' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] mb-0.5 text-sm font-medium transition-all text-left"
              style={{
                background: activeTab === item.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
              {item.icon} {item.label}
              {item.id === 'reviews' && pendingReviews > 0 && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: 'var(--gold)', color: '#1a1208', fontWeight: 700 }}>{pendingReviews}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-all text-left"
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.15)'; e.currentTarget.style.color = '#ff8080' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 md:px-6 h-14 shrink-0 border-b"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-2"><Menu size={20} /></button>
            <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Bell con dropdown */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markAllRead() }}
                className="btn-ghost p-2 relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-white px-1"
                    style={{ background: '#ef4444', fontSize: '0.6rem', fontWeight: 700, lineHeight: 1 }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '320px', background: 'var(--bg-card)',
                    border: '1px solid var(--border)', borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      Notificaciones
                    </p>
                    <button
                      onClick={() => setNotifOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <XIcon size={15} />
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                      Sin notificaciones
                    </div>
                  ) : (
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markOneRead(n.id)}
                          className="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: n.read ? 'transparent' : 'rgba(239,68,68,0.04)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                          onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(239,68,68,0.04)'}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: 'rgba(239,68,68,0.1)' }}
                          >
                            <XCircle size={15} style={{ color: '#ef4444' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                              Reserva cancelada
                            </p>
                            <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                              <strong>{n.userName}</strong> canceló su reserva en <strong>{n.propertyName}</strong>
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {fmtNotif(n.createdAt)}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: '#ef4444' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => setActiveTab('properties')} className="btn-primary text-sm py-2 px-4 hidden sm:flex">
              <PlusCircle size={15} /> Nueva propiedad
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'overview'    && <OverviewTab realStats={realStats} recentBookings={bookings.slice(0, 3)} pendingReviewsCount={pendingReviews} />}
          {activeTab === 'properties'  && <PropertiesTab />}
          {activeTab === 'bookings'    && <BookingsTab bookings={bookings} onUpdateStatus={updateBookingStatus} />}
          {activeTab === 'reviews'     && <ReviewsTab reviews={reviews} onApprove={approveReview} onReject={rejectReview} />}
          {activeTab === 'settings'    && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}
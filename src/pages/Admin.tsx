import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Home, PlusCircle, Star, Settings, LogOut, Menu, X,
  TrendingUp, Calendar, DollarSign, Eye, Edit2, Trash2, CheckCircle,
  XCircle, Clock, Leaf, MoreVertical, Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { PROPERTIES, ADMIN_STATS, type Property } from '../data/properties'

type AdminTab = 'overview' | 'properties' | 'bookings' | 'reviews' | 'settings'

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',    label: 'Resumen',       icon: <LayoutDashboard size={18} /> },
  { id: 'properties',  label: 'Propiedades',   icon: <Home size={18} /> },
  { id: 'bookings',    label: 'Reservas',      icon: <Calendar size={18} /> },
  { id: 'reviews',     label: 'Reseñas',       icon: <Star size={18} /> },
  { id: 'settings',    label: 'Configuración', icon: <Settings size={18} /> },
]

const MOCK_BOOKINGS = [
  { id: 'B001', guest: 'Ana Jiménez',  property: 'Nayara Springs',    checkIn: '2025-07-10', checkOut: '2025-07-14', status: 'confirmed', total: 1940 },
  { id: 'B002', guest: 'Luis Mora',    property: 'Arenas del Mar',    checkIn: '2025-07-15', checkOut: '2025-07-18', status: 'pending',   total: 960  },
  { id: 'B003', guest: 'Sarah Connor', property: 'Villa Caribe Azul', checkIn: '2025-07-20', checkOut: '2025-07-25', status: 'confirmed', total: 975  },
  { id: 'B004', guest: 'Pedro Arias',  property: 'Eco Selva Lodge',   checkIn: '2025-08-01', checkOut: '2025-08-03', status: 'cancelled', total: 230  },
]

const INITIAL_REVIEWS = [
  { id: 'R001', guest: 'María V.',   property: 'Nayara Springs',  rating: 5, comment: 'Experiencia increíble, el servicio fue impecable y las vistas al volcán son de otro mundo.', date: '2025-06-15', approved: true  },
  { id: 'R002', guest: 'John D.',    property: 'Arenas del Mar',  rating: 4, comment: 'Muy buen hotel, la piscina infinita es espectacular. El desayuno podría mejorar.', date: '2025-06-20', approved: true  },
  { id: 'R003', guest: 'Carla M.',   property: 'Eco Selva Lodge', rating: 5, comment: 'El lodge más auténtico que he visitado. La guía de aves fue fantástica.', date: '2025-06-28', approved: false },
  { id: 'R004', guest: 'Roberto P.', property: 'Villa Caribe',    rating: 3, comment: 'Bonita ubicación pero la limpieza dejó algo que desear.', date: '2025-07-01', approved: false },
]

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
function OverviewTab() {
  const stats = [
    { label: 'Propiedades activas', value: ADMIN_STATS.totalProperties,                       icon: <Home size={20} />,         color: 'var(--forest-light)', change: '+3 este mes' },
    { label: 'Reservas activas',    value: ADMIN_STATS.activeBookings,                        icon: <Calendar size={20} />,     color: 'var(--turquoise-mid)', change: '+12% vs mes anterior' },
    { label: 'Ingresos del mes',    value: `$${ADMIN_STATS.monthlyRevenue.toLocaleString()}`, icon: <DollarSign size={20} />,   color: 'var(--gold)',          change: '+8% vs mes anterior' },
    { label: 'Tasa de ocupación',   value: `${ADMIN_STATS.occupancyRate}%`,                   icon: <TrendingUp size={20} />,   color: 'var(--earth-light)',   change: '↑ 5pts vs mes anterior' },
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
            {MOCK_BOOKINGS.slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--bg-subtle)', color: 'var(--accent)' }}>{b.guest.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.guest}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.property}</p>
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
            <span className="ml-2 badge badge-gold">{INITIAL_REVIEWS.filter(r => !r.approved).length}</span>
          </h3>
          <div className="space-y-3">
            {INITIAL_REVIEWS.filter(r => !r.approved).map(r => (
              <div key={r.id} className="p-3 rounded-[var(--radius-md)]" style={{ background: 'var(--bg-subtle)' }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.guest}</p>
                  <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>
                <div className="flex gap-2">
                  <button className="btn-primary text-xs py-1 px-3">Aprobar</button>
                  <button className="btn-secondary text-xs py-1 px-3">Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertiesTab({ properties, onDelete }: { properties: Property[]; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="relative">
          <input type="text" placeholder="Buscar propiedad..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm" style={{ width: '260px' }} />
          <Eye size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        </div>
        <button className="btn-primary text-sm py-2"><PlusCircle size={15} /> Agregar propiedad</button>
      </div>
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
                    <img src={p.image} alt="" className="w-10 h-10 rounded-[var(--radius-md)] object-cover" />
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
                <td className="px-4 py-3"><span className="badge badge-green text-xs">Activa</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="btn-ghost p-1.5" title="Editar"><Edit2 size={14} /></button>
                    <button className="btn-ghost p-1.5" title="Ver"><Eye size={14} /></button>
                    <button onClick={() => onDelete(p.id)} className="btn-ghost p-1.5" style={{ color: '#ef4444' }} title="Eliminar">
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
    </div>
  )
}

function BookingsTab() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Reservas</h2>
      <div className="rounded-[var(--radius-lg)] overflow-auto border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
              {['ID','Huésped','Propiedad','Check-in','Check-out','Total','Estado',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_BOOKINGS.map(b => (
              <tr key={b.id} className="border-b transition-colors" style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{b.id}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.guest}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.property}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.checkIn}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{b.checkOut}</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${b.total}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3"><button className="btn-ghost p-1.5"><MoreVertical size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReviewsTab() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const approve = (id: string) => setReviews(r => r.map(x => x.id === id ? { ...x, approved: true } : x))
  const reject  = (id: string) => setReviews(r => r.filter(x => x.id !== id))
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
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>(PROPERTIES)

  const handleLogout = () => { logout(); navigate('/') }
  const deleteProperty = (id: string) => setProperties(prev => prev.filter(p => p.id !== id))
  const pendingReviews = INITIAL_REVIEWS.filter(r => !r.approved).length

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
            <button className="btn-ghost p-2 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--forest-light)' }} />
            </button>
            <button onClick={() => setActiveTab('properties')} className="btn-primary text-sm py-2 px-4 hidden sm:flex">
              <PlusCircle size={15} /> Nueva propiedad
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'overview'    && <OverviewTab />}
          {activeTab === 'properties'  && <PropertiesTab properties={properties} onDelete={deleteProperty} />}
          {activeTab === 'bookings'    && <BookingsTab />}
          {activeTab === 'reviews'     && <ReviewsTab />}
          {activeTab === 'settings'    && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

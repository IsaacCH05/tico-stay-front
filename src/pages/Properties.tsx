import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3X3, List, Search } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import SearchBar from '../components/SearchBar'
import { PROPERTIES, REGIONS, type Property } from '../data/properties'
import api from '../api'

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating'

const TYPES: Property['type'][] = ['hotel', 'eco-lodge', 'villa', 'cabaña', 'apartamento']
const TYPE_LABELS: Record<Property['type'], string> = {
  hotel: 'Hotel',
  'eco-lodge': 'Eco-Lodge',
  villa: 'Villa',
  cabaña: 'Cabaña',
  apartamento: 'Apartamento',
}
const AMENITY_OPTIONS = ['Piscina', 'Wi-Fi', 'Playa', 'Desayuno incluido', 'Spa', 'Estacionamiento', 'Restaurante', 'Yoga']

interface Filters {
  types: Property['type'][]
  regions: string[]
  priceMin: number
  priceMax: number
  minRating: number
  amenities: string[]
  ecoOnly: boolean
}

const DEFAULT_FILTERS: Filters = {
  types: [],
  regions: [],
  priceMin: 0,
  priceMax: 1000,
  minRating: 0,
  amenities: [],
  ecoOnly: false,
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

function mapApiProp(raw: Record<string, unknown>): Property {
  return {
    id:          (raw._id ?? raw.id) as string,
    name:        (raw.name ?? '') as string,
    type:        (raw.type ?? 'villa') as Property['type'],
    location:    (raw.location ?? '') as string,
    region:      (raw.region ?? '') as string,
    price:       (raw.price ?? 0) as number,
    rating:      (raw.rating ?? 0) as number,
    reviewCount: (raw.reviewCount ?? 0) as number,
    image:       (raw.image ?? '') as string,
    images:      Array.isArray(raw.images) ? raw.images as string[] : [(raw.image ?? '') as string],
    amenities:   Array.isArray(raw.amenities) ? raw.amenities as string[] : [],
    description: (raw.description ?? '') as string,
    featured:    (raw.featured ?? false) as boolean,
    ecoFriendly: (raw.ecoFriendly ?? false) as boolean,
    maxGuests:   (raw.maxGuests ?? 2) as number,
    bedrooms:    (raw.bedrooms ?? 1) as number,
    bathrooms:   (raw.bathrooms ?? 1) as number,
  }
}

export default function Properties() {
  const [searchParams] = useSearchParams()
  const query    = searchParams.get('q') ?? ''
  const regionQP = searchParams.get('region') ?? ''

  const [apiProperties, setApiProperties] = useState<Property[]>([])

  useEffect(() => {
    api.get('/properties')
      .then(res => setApiProperties((res.data as Record<string, unknown>[]).map(mapApiProp)))
      .catch(() => {})
  }, [])

  // DB properties first, then static ones not already present by name
  const ALL_PROPERTIES = useMemo(() => {
    const dbNames = new Set(apiProperties.map(p => p.name.toLowerCase()))
    return [...apiProperties, ...PROPERTIES.filter(p => !dbNames.has(p.name.toLowerCase()))]
  }, [apiProperties])

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    regions: regionQP && regionQP !== 'all' ? [regionQP] : [],
  })
  const [sort, setSort] = useState<SortKey>('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true, region: true, price: true, rating: true, amenities: false, eco: true,
  })

  const toggleSection = (k: string) =>
    setExpandedSections(s => ({ ...s, [k]: !s[k] }))

  const results = useMemo(() => {
    let list = [...ALL_PROPERTIES]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.amenities.some(a => a.toLowerCase().includes(q))
      )
    }
    if (filters.types.length)   list = list.filter(p => filters.types.includes(p.type))
    if (filters.regions.length) list = list.filter(p => filters.regions.includes(p.region))
    if (filters.ecoOnly)        list = list.filter(p => p.ecoFriendly)
    list = list.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax)
    list = list.filter(p => p.rating >= filters.minRating)
    if (filters.amenities.length)
      list = list.filter(p =>
        filters.amenities.every(a =>
          p.amenities.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
        )
      )
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating)
    return list
  }, [query, filters, sort, ALL_PROPERTIES])

  const activeFilterCount =
    filters.types.length + filters.regions.length +
    (filters.ecoOnly ? 1 : 0) + (filters.minRating > 0 ? 1 : 0) +
    filters.amenities.length + (filters.priceMax < 1000 ? 1 : 0)

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  const SidebarContent = () => (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Filtros
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-xs flex items-center gap-1"
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <X size={12} /> Limpiar ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterSection label="Tipo de alojamiento" open={expandedSections.type} onToggle={() => toggleSection('type')}>
        <div className="flex flex-col gap-2">
          {TYPES.map(t => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={filters.types.includes(t)}
                onChange={() => setFilters(f => ({ ...f, types: toggle(f.types, t) }))}
                className="w-4 h-4 rounded accent-[var(--accent)]" />
              <span className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>{TYPE_LABELS[t]}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection label="Región" open={expandedSections.region} onToggle={() => toggleSection('region')}>
        <div className="flex flex-col gap-2">
          {REGIONS.map(r => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={filters.regions.includes(r)}
                onChange={() => setFilters(f => ({ ...f, regions: toggle(f.regions, r) }))}
                className="w-4 h-4 rounded accent-[var(--accent)]" />
              <span className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>{r}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection label="Precio por noche" open={expandedSections.price} onToggle={() => toggleSection('price')}>
        <div>
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>${filters.priceMin}</span>
            <span>{filters.priceMax >= 1000 ? '$1000+' : `$${filters.priceMax}`}</span>
          </div>
          <input type="range" min={0} max={1000} step={25} value={filters.priceMax}
            onChange={e => setFilters(f => ({ ...f, priceMax: Number(e.target.value) }))}
            className="w-full accent-[var(--accent)]" />
        </div>
      </FilterSection>

      <FilterSection label="Calificación mínima" open={expandedSections.rating} onToggle={() => toggleSection('rating')}>
        <div className="flex gap-2 flex-wrap">
          {[0, 3, 4, 4.5].map(r => (
            <button key={r} onClick={() => setFilters(f => ({ ...f, minRating: r }))}
              className="px-3 py-1.5 rounded-full text-sm transition-all"
              style={{
                background: filters.minRating === r ? 'var(--accent)' : 'var(--bg-subtle)',
                color: filters.minRating === r ? 'var(--accent-fg)' : 'var(--text-secondary)',
                border: '1.5px solid', borderColor: filters.minRating === r ? 'var(--accent)' : 'var(--border)',
                fontFamily: 'var(--font-body)', cursor: 'pointer',
              }}>
              {r === 0 ? 'Todos' : `${r}★`}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection label="Sostenibilidad" open={expandedSections.eco} onToggle={() => toggleSection('eco')}>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={filters.ecoOnly}
            onChange={e => setFilters(f => ({ ...f, ecoOnly: e.target.checked }))}
            className="w-4 h-4 rounded accent-[var(--accent)]" />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>🌿 Solo eco-friendly</span>
        </label>
      </FilterSection>

      <FilterSection label="Amenidades" open={expandedSections.amenities} onToggle={() => toggleSection('amenities')}>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map(a => (
            <button key={a} onClick={() => setFilters(f => ({ ...f, amenities: toggle(f.amenities, a) }))}
              className="px-2.5 py-1 rounded-full text-xs transition-all"
              style={{
                background: filters.amenities.includes(a) ? 'var(--accent)' : 'var(--bg-subtle)',
                color: filters.amenities.includes(a) ? 'var(--accent-fg)' : 'var(--text-secondary)',
                border: '1.5px solid', borderColor: filters.amenities.includes(a) ? 'var(--accent)' : 'var(--border)',
                fontFamily: 'var(--font-body)', cursor: 'pointer',
              }}>
              {a}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="pt-20 pb-6 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="container">
          <div className="max-w-3xl">
            <SearchBar inline initialValues={{ location: query }} />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {query ? `Resultados para "${query}"` : regionQP && regionQP !== 'all' ? regionQP : 'Todas las propiedades'}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {results.length} {results.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden btn-secondary text-sm py-2 flex items-center gap-2">
              <SlidersHorizontal size={15} />
              Filtros {activeFilterCount > 0 && (
                <span className="badge badge-green py-0 px-1.5">{activeFilterCount}</span>
              )}
            </button>

            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
              className="input-field py-2 text-sm" style={{ minWidth: '160px' }}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificación</option>
            </select>

            <div className="hidden sm:flex rounded-[var(--radius-md)] overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)} className="p-2 transition-colors"
                  style={{
                    background: viewMode === v ? 'var(--accent)' : 'var(--bg-card)',
                    color: viewMode === v ? 'var(--accent-fg)' : 'var(--text-muted)',
                    border: 'none', cursor: 'pointer',
                  }}>
                  {v === 'grid' ? <Grid3X3 size={16} /> : <List size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.types.map(t => <FilterChip key={t} label={TYPE_LABELS[t]} onRemove={() => setFilters(f => ({ ...f, types: toggle(f.types, t) }))} />)}
            {filters.regions.map(r => <FilterChip key={r} label={r} onRemove={() => setFilters(f => ({ ...f, regions: toggle(f.regions, r) }))} />)}
            {filters.ecoOnly && <FilterChip label="Eco-friendly" onRemove={() => setFilters(f => ({ ...f, ecoOnly: false }))} />}
            {filters.minRating > 0 && <FilterChip label={`${filters.minRating}★ mín.`} onRemove={() => setFilters(f => ({ ...f, minRating: 0 }))} />}
            {filters.amenities.map(a => <FilterChip key={a} label={a} onRemove={() => setFilters(f => ({ ...f, amenities: toggle(f.amenities, a) }))} />)}
          </div>
        )}

        <div className="flex gap-8">
          <div className="hidden lg:block shrink-0 sticky top-20 h-fit"
            style={{ width: '260px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <SidebarContent />
          </div>

          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-80 overflow-y-auto animate-fade-in"
                style={{ background: 'var(--bg-card)', padding: '1.5rem' }} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filtros</span>
                  <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1"><X size={18} /></button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {results.length === 0 ? (
              <div className="text-center py-20">
                <Search size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  Sin resultados
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Intenta ajustar los filtros o busca otro destino.</p>
                <button onClick={resetFilters} className="btn-primary">Limpiar filtros</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
                {results.map((p, i) => (
                  <div key={p.id} className="opacity-0 animate-fade-up"
                    style={{ animationFillMode: 'forwards', animationDelay: `${Math.min(i, 6) * 0.05}s` }}>
                    <PropertyCard property={p} compact={viewMode === 'list'} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterSection({ label, open, onToggle, children }: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between mb-3"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, padding: 0 }}>
        {label}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: 'rgba(82,183,136,0.12)', color: 'var(--accent)', border: '1px solid rgba(82,183,136,0.25)' }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
        <X size={11} />
      </button>
    </span>
  )
}

export interface Property {
  id: string
  name: string
  type: 'hotel' | 'eco-lodge' | 'villa' | 'cabaña' | 'apartamento'
  location: string
  region: string
  price: number
  rating: number
  reviewCount: number
  image: string
  images: string[]
  amenities: string[]
  description: string
  featured: boolean
  ecoFriendly: boolean
  maxGuests: number
  bedrooms: number
  bathrooms: number
}

export const REGIONS = [
  'San José',
  'Guanacaste',
  'Caribe',
  'Pacífico Central',
  'Zona Sur',
  'Alajuela',
  'Heredia',
]

export const PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Nayara Springs',
    type: 'eco-lodge',
    location: 'La Fortuna, Alajuela',
    region: 'Alajuela',
    price: 485,
    rating: 4.9,
    reviewCount: 324,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    ],
    amenities: ['Piscina privada', 'Spa', 'Vista al volcán', 'Desayuno incluido', 'Wi-Fi'],
    description: 'Un eco-lodge de lujo con vistas al Volcán Arenal, piscinas termales privadas y jardines tropicales.',
    featured: true,
    ecoFriendly: true,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '2',
    name: 'Arenas del Mar',
    type: 'hotel',
    location: 'Manuel Antonio, Puntarenas',
    region: 'Pacífico Central',
    price: 320,
    rating: 4.8,
    reviewCount: 218,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    ],
    amenities: ['Playa privada', 'Piscina infinita', 'Restaurante', 'Vista al mar', 'Yoga'],
    description: 'Hotel boutique en las alturas de Manuel Antonio con vistas espectaculares al océano Pacífico.',
    featured: true,
    ecoFriendly: true,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: '3',
    name: 'Villa Caribe Azul',
    type: 'villa',
    location: 'Puerto Viejo, Limón',
    region: 'Caribe',
    price: 195,
    rating: 4.7,
    reviewCount: 87,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    ],
    amenities: ['Playa a 50m', 'Hamacas', 'Cocina equipada', 'Jardín tropical'],
    description: 'Villa caribeña con jardines exuberantes a pasos de las playas de Puerto Viejo.',
    featured: false,
    ecoFriendly: false,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '4',
    name: 'Hacienda Guanacaste',
    type: 'cabaña',
    location: 'Tamarindo, Guanacaste',
    region: 'Guanacaste',
    price: 145,
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    ],
    amenities: ['Piscina', 'BBQ', 'Parqueo', 'Aire acondicionado', 'Wi-Fi'],
    description: 'Cabañas rústicas con estilo sabanero en el corazón de Guanacaste, cerca de playas de clase mundial.',
    featured: false,
    ecoFriendly: false,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: '5',
    name: 'Eco Selva Lodge',
    type: 'eco-lodge',
    location: 'Turrialba, Cartago',
    region: 'San José',
    price: 115,
    rating: 4.5,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    ],
    amenities: ['Senderismo', 'Observación de aves', 'Desayuno típico', 'Tour guiado'],
    description: 'Alojamiento sostenible en las faldas del Volcán Turrialba, rodeado de bosque nuboso.',
    featured: true,
    ecoFriendly: true,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '6',
    name: 'Osa Rainforest Retreat',
    type: 'eco-lodge',
    location: 'Puerto Jiménez, Puntarenas',
    region: 'Zona Sur',
    price: 275,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800&q=80',
    ],
    amenities: ['Playa privada', 'Wildlife tours', 'Kayak', 'Yoga deck', 'Orgánico'],
    description: 'Retiro exclusivo en la Península de Osa, uno de los lugares con mayor biodiversidad del planeta.',
    featured: true,
    ecoFriendly: true,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '7',
    name: 'Apartamento San José Centro',
    type: 'apartamento',
    location: 'Barrio Amón, San José',
    region: 'San José',
    price: 75,
    rating: 4.3,
    reviewCount: 211,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    amenities: ['Wi-Fi', 'Cocina', 'Gym', 'Seguridad 24h', 'Parking'],
    description: 'Moderno apartamento en el histórico Barrio Amón, cerca de museos, restaurantes y vida nocturna.',
    featured: false,
    ecoFriendly: false,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '8',
    name: 'Playa Hermosa Surf House',
    type: 'cabaña',
    location: 'Playa Hermosa, Guanacaste',
    region: 'Guanacaste',
    price: 98,
    rating: 4.4,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    ],
    amenities: ['Surf storage', 'Outdoor shower', 'BBQ', 'Hamacas', 'Board rental'],
    description: 'Casa de surf a pasos de las mejores olas del Pacífico Norte, perfecta para surfistas.',
    featured: false,
    ecoFriendly: false,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
  },
]

export const ADMIN_STATS = {
  totalProperties: 24,
  activeBookings: 87,
  monthlyRevenue: 48320,
  occupancyRate: 73,
  newReviews: 12,
  pendingApprovals: 3,
}

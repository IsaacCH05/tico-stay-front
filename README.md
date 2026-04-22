# TicoStay — Frontend

Plataforma de alquiler de propiedades en Costa Rica. Construida con React 18, TypeScript y Vite.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilos | TailwindCSS + variables CSS personalizadas |
| Routing | React Router v6 |
| HTTP | Axios (instancia `src/api.ts`) |
| Autenticación | JWT (backend propio) + Firebase Auth |
| Iconos | Lucide React |

## Requisitos

- Node.js 18+
- Backend TicoStay corriendo en `http://localhost:5000`

## Instalación

```bash
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

## Desarrollo

```bash
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # build de producción
npm run preview    # previsualizar el build
```

## Estructura del proyecto

```
src/
├── api.ts                  # instancia Axios con interceptor JWT
├── App.tsx                 # rutas principales
├── main.tsx                # punto de entrada, providers
├── context/
│   ├── AuthContext.tsx     # usuario autenticado, login/register/logout
│   ├── BookingContext.tsx  # reservas (CRUD contra API)
│   └── ThemeContext.tsx    # modo claro/oscuro
├── components/
│   ├── Navbar.tsx          # barra de navegación con menú de usuario
│   ├── PropertyCard.tsx    # tarjeta de propiedad (grid y list)
│   └── SearchBar.tsx       # buscador con filtro de región
├── pages/
│   ├── Home.tsx            # landing con hero, destacados y regiones
│   ├── Properties.tsx      # listado con filtros y ordenamiento
│   ├── PropertyDetail.tsx  # detalle de propiedad + card de reserva
│   ├── Booking.tsx         # formulario de reserva
│   ├── MyBookings.tsx      # mis reservas (cancelar)
│   ├── Admin.tsx           # panel de administración
│   ├── Login.tsx           # inicio de sesión
│   └── Register.tsx        # registro de cuenta
└── data/
    └── properties.ts       # propiedades estáticas de muestra + tipos
```

## Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Home | Público |
| `/propiedades` | Listado | Público |
| `/propiedad/:id` | Detalle | Público |
| `/reservar/:id` | Reserva | Autenticado |
| `/mis-reservas` | Mis reservas | Autenticado |
| `/admin` | Panel admin | Admin |
| `/iniciar-sesion` | Login | — |
| `/registrarse` | Registro | — |

## Flujo de reservas

1. Usuario selecciona fechas y huéspedes en la página de detalle
2. Al hacer clic en **Reservar**, se crea una reserva con estado `pending`
3. El admin recibe la solicitud en el panel y la confirma o cancela
4. El usuario puede ver el estado en **Mis Reservas**
5. Si el usuario cancela una reserva `confirmed`, se genera una notificación al admin

## Panel de administración

- **Resumen**: estadísticas en tiempo real (reservas, propiedades, reseñas)
- **Reservas**: confirmar o cancelar solicitudes pendientes
- **Propiedades**: crear, editar y eliminar propiedades (persisten en MongoDB)
- **Reseñas**: aprobar o rechazar reseñas de usuarios

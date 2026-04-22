import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { MainLayout, AuthLayout, AdminLayout } from './layouts/Layouts'
import Home            from './pages/Home'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Properties      from './pages/Properties'
import PropertyDetail  from './pages/PropertyDetail'
import Booking         from './pages/Booking'
import MyBookings      from './pages/MyBookings'
import Admin           from './pages/Admin'

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/iniciar-sesion" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/"               element={<Home />} />
                <Route path="/propiedades"    element={<Properties />} />
                <Route path="/propiedad/:id"  element={<PropertyDetail />} />
                <Route path="/reservar/:id"   element={<Booking />} />
                <Route path="/mis-reservas"   element={<MyBookings />} />
              </Route>
              <Route element={<AuthLayout />}>
                <Route path="/iniciar-sesion" element={<Login />} />
                <Route path="/registrarse"    element={<Register />} />
              </Route>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

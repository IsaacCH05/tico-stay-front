import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MainLayout, AuthLayout, AdminLayout } from './layouts/Layouts'
import Home       from './pages/Home'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Properties from './pages/Properties'
import Admin      from './pages/Admin'
import PropertyDetail from './pages/PropertyDetail'

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
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/"            element={<Home />} />
              <Route path="/propiedades" element={<Properties />} />
              <Route path="/propiedad/:id" element={<PropertyDetail />} />
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
      </AuthProvider>
    </ThemeProvider>
  )
}

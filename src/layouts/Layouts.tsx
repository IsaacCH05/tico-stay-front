import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export function AuthLayout() {
  return <Outlet />
}

export function AdminLayout() {
  return <Outlet />
}

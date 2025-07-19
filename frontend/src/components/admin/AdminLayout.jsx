import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from '../../pages/AdminDashboard'
import MovieManagement from '../../pages/MovieManagement'
import MovieFormPage from '../../pages/MovieFormPage'

function AdminLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<MovieManagement />} />
            <Route path="movies/new" element={<MovieFormPage />} />
            <Route path="movies/edit/:id" element={<MovieFormPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
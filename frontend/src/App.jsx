import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import PublicSearch from './pages/PublicSearch'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Header />
              <PublicSearch />
            </>
          } 
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </div>
  )
}

export default App
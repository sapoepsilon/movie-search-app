import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Settings } from 'lucide-react'

function Header() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin')
    } else {
      navigate('/admin/login')
    }
  }

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Movie Search</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdminClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </Button>
            <span className="text-sm text-muted-foreground">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
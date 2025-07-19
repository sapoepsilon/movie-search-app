import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { adminApi } from '../services/adminApi'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Plus, Film, BarChart } from 'lucide-react'

function AdminDashboard() {
  const { apiKey } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalMovies: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const movies = await adminApi.movies.list(apiKey, { top: 1000 })
        setStats({
          totalMovies: Array.isArray(movies) ? movies.length : 0,
          loading: false,
          error: null
        })
      } catch (error) {
        setStats({
          totalMovies: 0,
          loading: false,
          error: error.message
        })
      }
    }

    if (apiKey) {
      fetchStats()
    }
  }, [apiKey])

  const quickActions = [
    {
      title: 'Add New Movie',
      description: 'Create a new movie entry',
      icon: Plus,
      action: () => navigate('/admin/movies/new'),
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Movies',
      description: 'View and edit existing movies',
      icon: Film,
      action: () => navigate('/admin/movies'),
      color: 'bg-green-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Movie Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Movies</h3>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.loading ? '...' : stats.error ? 'Error' : stats.totalMovies.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.error ? stats.error : 'Movies in the database'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Quick Add</h3>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/admin/movies/new')}
              className="w-full"
            >
              Add New Movie
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Management</h3>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/admin/movies')}
              variant="outline"
              className="w-full"
            >
              Manage Movies
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6" onClick={action.action}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">System Info</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Status:</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database:</span>
              <span className="font-medium">SQLite (In-Memory)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Backend Version:</span>
              <span className="font-medium">SAP CAP v1.0.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
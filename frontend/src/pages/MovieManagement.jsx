import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { adminApi } from '../services/adminApi'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Edit, Trash2, Plus, Search, RefreshCw } from 'lucide-react'

function MovieManagement() {
  const { apiKey } = useAuth()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.movies.list(apiKey, { top: 1000 })
      setMovies(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiKey) {
      fetchMovies()
    }
  }, [apiKey])

  const handleEdit = (movieId) => {
    navigate(`/admin/movies/edit/${movieId}`)
  }

  const handleDelete = async (movie) => {
    if (!window.confirm(`Are you sure you want to delete "${movie.Title}"?`)) {
      return
    }

    try {
      setDeleting(movie.ID)
      await adminApi.movies.delete(apiKey, movie.ID)
      await fetchMovies()
    } catch (err) {
      setError(`Failed to delete movie: ${err.message}`)
    } finally {
      setDeleting(null)
    }
  }

  const filteredMovies = movies.filter(movie =>
    movie.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.imdbID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.Director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.Genre?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading movies...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Movie Management</h1>
          <p className="text-muted-foreground">Manage your movie database</p>
        </div>
        <Button onClick={() => navigate('/admin/movies/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Movie
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMovies}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Movies ({filteredMovies.length})</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={fetchMovies}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No movies found matching your search' : 'No movies in database'}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/admin/movies/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Movie
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Poster</th>
                    <th className="text-left p-2 font-medium">Title</th>
                    <th className="text-left p-2 font-medium">Year</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-left p-2 font-medium">Director</th>
                    <th className="text-left p-2 font-medium">Genre</th>
                    <th className="text-left p-2 font-medium">Rating</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie) => (
                    <tr key={movie.ID} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        {movie.Poster ? (
                          <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="w-12 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-12 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{movie.Title}</div>
                          <div className="text-sm text-muted-foreground">{movie.imdbID}</div>
                        </div>
                      </td>
                      <td className="p-2 text-sm">{movie.Year || '-'}</td>
                      <td className="p-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {movie.Type || 'movie'}
                        </span>
                      </td>
                      <td className="p-2 text-sm">{movie.Director || '-'}</td>
                      <td className="p-2 text-sm">{movie.Genre || '-'}</td>
                      <td className="p-2 text-sm">
                        {movie.imdbRating ? (
                          <span className="font-medium">⭐ {movie.imdbRating}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(movie.ID)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(movie)}
                            disabled={deleting === movie.ID}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deleting === movie.ID ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MovieManagement
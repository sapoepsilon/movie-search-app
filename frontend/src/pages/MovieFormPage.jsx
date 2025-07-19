import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { adminApi } from '../services/adminApi'
import MovieForm from '../components/admin/MovieForm'
import { Card, CardContent } from '../components/ui/card'
import { RefreshCw } from 'lucide-react'

function MovieFormPage() {
  const { id } = useParams()
  const { apiKey } = useAuth()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isEdit = Boolean(id)

  useEffect(() => {
    if (isEdit && apiKey) {
      fetchMovie()
    }
  }, [id, apiKey, isEdit])

  const fetchMovie = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.movies.get(apiKey, id)
      setMovie(data)
    } catch (err) {
      setError(`Failed to load movie: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setSaving(true)
      setError(null)

      if (isEdit) {
        await adminApi.movies.update(apiKey, id, formData)
      } else {
        await adminApi.movies.create(apiKey, formData)
      }

      navigate('/admin/movies')
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} movie: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/movies')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading movie...</span>
      </div>
    )
  }

  if (isEdit && error) {
    return (
      <Card className="max-w-4xl mx-auto border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-800 mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={fetchMovie}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-100"
            >
              Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Movie' : 'Add New Movie'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Update movie information' : 'Create a new movie entry'}
        </p>
      </div>

      {error && !isEdit && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <MovieForm
        movie={movie}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  )
}

export default MovieFormPage
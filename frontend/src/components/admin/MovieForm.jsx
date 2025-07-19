import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader } from '../ui/card'

function MovieForm({ movie, onSubmit, onCancel, loading = false }) {
  const { apiKey } = useAuth()
  const [formData, setFormData] = useState({
    imdbID: '',
    Title: '',
    Year: '',
    Type: 'movie',
    Plot: '',
    Director: '',
    Actors: '',
    Genre: '',
    Runtime: '',
    Rated: '',
    Released: '',
    imdbRating: '',
    Poster: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (movie) {
      setFormData({
        imdbID: movie.imdbID || '',
        Title: movie.Title || '',
        Year: movie.Year || '',
        Type: movie.Type || 'movie',
        Plot: movie.Plot || '',
        Director: movie.Director || '',
        Actors: movie.Actors || '',
        Genre: movie.Genre || '',
        Runtime: movie.Runtime || '',
        Rated: movie.Rated || '',
        Released: movie.Released || '',
        imdbRating: movie.imdbRating || '',
        Poster: movie.Poster || ''
      })
    }
  }, [movie])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.imdbID.trim()) {
      newErrors.imdbID = 'IMDB ID is required'
    } else if (formData.imdbID.length > 20) {
      newErrors.imdbID = 'IMDB ID must be 20 characters or less'
    }
    
    if (!formData.Title.trim()) {
      newErrors.Title = 'Title is required'
    } else if (formData.Title.length > 200) {
      newErrors.Title = 'Title must be 200 characters or less'
    }
    
    if (formData.Year && !/^\d{4}$/.test(formData.Year)) {
      newErrors.Year = 'Year must be a 4-digit number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const movieTypes = [
    { value: 'movie', label: 'Movie' },
    { value: 'series', label: 'Series' },
    { value: 'episode', label: 'Episode' }
  ]

  const ratings = [
    { value: 'G', label: 'G' },
    { value: 'PG', label: 'PG' },
    { value: 'PG-13', label: 'PG-13' },
    { value: 'R', label: 'R' },
    { value: 'NC-17', label: 'NC-17' },
    { value: 'Not Rated', label: 'Not Rated' }
  ]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">
          {movie ? 'Edit Movie' : 'Add New Movie'}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="imdbID" className="block text-sm font-medium mb-1">
                IMDB ID *
              </label>
              <Input
                id="imdbID"
                name="imdbID"
                value={formData.imdbID}
                onChange={handleChange}
                placeholder="tt1234567"
                disabled={loading}
                required
              />
              {errors.imdbID && (
                <p className="text-sm text-red-600 mt-1">{errors.imdbID}</p>
              )}
            </div>

            <div>
              <label htmlFor="Title" className="block text-sm font-medium mb-1">
                Title *
              </label>
              <Input
                id="Title"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                placeholder="Movie Title"
                disabled={loading}
                required
              />
              {errors.Title && (
                <p className="text-sm text-red-600 mt-1">{errors.Title}</p>
              )}
            </div>

            <div>
              <label htmlFor="Year" className="block text-sm font-medium mb-1">
                Year
              </label>
              <Input
                id="Year"
                name="Year"
                value={formData.Year}
                onChange={handleChange}
                placeholder="2024"
                disabled={loading}
              />
              {errors.Year && (
                <p className="text-sm text-red-600 mt-1">{errors.Year}</p>
              )}
            </div>

            <div>
              <label htmlFor="Type" className="block text-sm font-medium mb-1">
                Type
              </label>
              <select
                id="Type"
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {movieTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="Director" className="block text-sm font-medium mb-1">
                Director
              </label>
              <Input
                id="Director"
                name="Director"
                value={formData.Director}
                onChange={handleChange}
                placeholder="Director Name"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="Actors" className="block text-sm font-medium mb-1">
                Actors
              </label>
              <Input
                id="Actors"
                name="Actors"
                value={formData.Actors}
                onChange={handleChange}
                placeholder="Actor 1, Actor 2, Actor 3"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="Genre" className="block text-sm font-medium mb-1">
                Genre
              </label>
              <Input
                id="Genre"
                name="Genre"
                value={formData.Genre}
                onChange={handleChange}
                placeholder="Action, Drama, Comedy"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="Runtime" className="block text-sm font-medium mb-1">
                Runtime
              </label>
              <Input
                id="Runtime"
                name="Runtime"
                value={formData.Runtime}
                onChange={handleChange}
                placeholder="120 min"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="Rated" className="block text-sm font-medium mb-1">
                Rating
              </label>
              <select
                id="Rated"
                name="Rated"
                value={formData.Rated}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Select Rating</option>
                {ratings.map(rating => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="Released" className="block text-sm font-medium mb-1">
                Release Date
              </label>
              <Input
                id="Released"
                name="Released"
                value={formData.Released}
                onChange={handleChange}
                placeholder="01 Jan 2024"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="imdbRating" className="block text-sm font-medium mb-1">
                IMDB Rating
              </label>
              <Input
                id="imdbRating"
                name="imdbRating"
                value={formData.imdbRating}
                onChange={handleChange}
                placeholder="8.5"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="Poster" className="block text-sm font-medium mb-1">
                Poster URL
              </label>
              <Input
                id="Poster"
                name="Poster"
                value={formData.Poster}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="Plot" className="block text-sm font-medium mb-1">
              Plot
            </label>
            <textarea
              id="Plot"
              name="Plot"
              value={formData.Plot}
              onChange={handleChange}
              placeholder="Movie plot description..."
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : (movie ? 'Update Movie' : 'Create Movie')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default MovieForm
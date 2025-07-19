import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchMovies, getMovieById } from '../../services/movieApi'

const mockApiResponse = {
  value: [{
    Search: [
      {
        imdbID: 'tt0111161',
        Title: 'The Shawshank Redemption',
        Year: '1994',
        Type: 'movie',
        Poster: 'https://example.com/poster.jpg'
      }
    ],
    totalResults: '1',
    Response: 'True'
  }]
}

const mockMovieResponse = {
  value: [{
    imdbID: 'tt0111161',
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
    Plot: 'Two imprisoned men bond over years...',
    Director: 'Frank Darabont',
    Response: 'True'
  }]
}

const mockErrorResponse = {
  value: [{
    Response: 'False',
    Error: 'Movie not found!'
  }]
}

global.fetch = vi.fn()

describe('movieApi', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('searchMovies', () => {
    it('searches movies successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      })

      const result = await searchMovies('shawshank')

      expect(fetch).toHaveBeenCalledWith('/api/Movies?s=shawshank&page=1')
      expect(result).toEqual({
        Search: mockApiResponse.value[0].Search,
        totalResults: '1',
        Response: 'True'
      })
    })

    it('searches with pagination', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      })

      await searchMovies('star', 2)

      expect(fetch).toHaveBeenCalledWith('/api/Movies?s=star&page=2')
    })

    it('searches with type filter', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      })

      await searchMovies('batman', 1, 'movie')

      expect(fetch).toHaveBeenCalledWith('/api/Movies?s=batman&page=1&type=movie')
    })

    it('handles API error response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse
      })

      const result = await searchMovies('nonexistent')

      expect(result).toEqual({
        Response: 'False',
        Error: 'Movie not found!'
      })
    })

    it('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await searchMovies('test')

      expect(result).toEqual({
        Response: 'False',
        Error: 'Network error occurred'
      })
    })
  })

  describe('getMovieById', () => {
    it('gets movie by ID successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovieResponse
      })

      const result = await getMovieById('tt0111161')

      expect(fetch).toHaveBeenCalledWith('/api/Movies?i=tt0111161')
      expect(result).toEqual(mockMovieResponse.value[0])
    })

    it('handles movie not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse
      })

      const result = await getMovieById('tt9999999')

      expect(result).toEqual({
        Response: 'False',
        Error: 'Movie not found!'
      })
    })
  })
})
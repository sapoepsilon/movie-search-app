import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../../App'

global.fetch = vi.fn()

describe('Filter Integration', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('applies type filter to search results', async () => {
    const mockResponse = {
      value: [{
        Response: 'True',
        Search: [
          { imdbID: 'tt1', Title: 'Movie 1', Year: '2020', Type: 'movie', Poster: 'poster1.jpg' }
        ],
        totalResults: '1'
      }]
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(<App />)
    
    const searchInput = screen.getByPlaceholderText('Search movies...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByTestId('type-filter-trigger')).toBeInTheDocument()
    })

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const filterTrigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(filterTrigger)
    
    const movieFilter = screen.getByTestId('filter-movie')
    fireEvent.click(movieFilter)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/Movies?s=test&page=1&type=movie')
    })
  })

  it('resets to page 1 when changing filter', async () => {
    const mockResponse = {
      value: [{
        Response: 'True',
        Search: Array.from({ length: 10 }, (_, i) => ({
          imdbID: `tt${i}`,
          Title: `Movie ${i}`,
          Year: '2020',
          Type: 'movie',
          Poster: 'poster.jpg'
        })),
        totalResults: '50'
      }]
    }

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })

    render(<App />)
    
    const searchInput = screen.getByPlaceholderText('Search movies...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByTestId('type-filter-trigger')).toBeInTheDocument()
    })

    const filterTrigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(filterTrigger)
    
    const movieFilter = screen.getByTestId('filter-movie')
    fireEvent.click(movieFilter)

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith('/api/Movies?s=test&page=1&type=movie')
    })
  })

  it('maintains filter selection across searches', async () => {
    const mockResponse = {
      value: [{
        Response: 'True',
        Search: [
          { imdbID: 'tt1', Title: 'Movie 1', Year: '2020', Type: 'movie', Poster: 'poster1.jpg' }
        ],
        totalResults: '1'
      }]
    }

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })

    render(<App />)
    
    const searchInput = screen.getByPlaceholderText('Search movies...')
    fireEvent.change(searchInput, { target: { value: 'first' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByTestId('type-filter-trigger')).toBeInTheDocument()
    })

    const filterTrigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(filterTrigger)
    
    const movieFilter = screen.getByTestId('filter-movie')
    fireEvent.click(movieFilter)

    fireEvent.change(searchInput, { target: { value: 'second' } })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith('/api/Movies?s=second&page=1&type=movie')
    })

    expect(screen.getByText('Movies')).toBeInTheDocument()
  })
})
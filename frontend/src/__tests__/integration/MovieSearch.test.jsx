import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../../App'

const mockSearchResponse = {
  Search: [
    {
      imdbID: 'tt0111161',
      Title: 'The Shawshank Redemption',
      Year: '1994',
      Type: 'movie',
      Poster: 'https://example.com/poster1.jpg'
    },
    {
      imdbID: 'tt0068646',
      Title: 'The Godfather',
      Year: '1972',
      Type: 'movie',
      Poster: 'https://example.com/poster2.jpg'
    }
  ],
  totalResults: '25',
  Response: 'True'
}

const mockErrorResponse = {
  Response: 'False',
  Error: 'Movie not found!'
}

global.fetch = vi.fn()

describe('Movie Search Integration', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('performs complete search flow', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ value: [mockSearchResponse] })
    })

    render(<App />)

    const searchInput = screen.getByRole('textbox')
    fireEvent.change(searchInput, { target: { value: 'shawshank' } })

    await waitFor(() => {
      expect(screen.getByText(/25 results/i)).toBeInTheDocument()
    }, { timeout: 1000 })

    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    expect(screen.getByText('The Godfather')).toBeInTheDocument()
  })

  it('handles search errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ value: [mockErrorResponse] })
    })

    render(<App />)

    const searchInput = screen.getByRole('textbox')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    await waitFor(() => {
      expect(screen.getByText('Movie not found!')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('shows loading state during search', async () => {
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => {
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ value: [mockSearchResponse] })
        }), 100)
      })
    )

    render(<App />)

    const searchInput = screen.getByRole('textbox')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument()
    })
  })

  it('handles pagination correctly', async () => {
    const mockPage2Response = {
      ...mockSearchResponse,
      Search: [
        {
          imdbID: 'tt0071562',
          Title: 'The Godfather Part II',
          Year: '1974',
          Type: 'movie',
          Poster: 'https://example.com/poster3.jpg'
        }
      ]
    }

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ value: [mockSearchResponse] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ value: [mockPage2Response] })
      })

    render(<App />)

    const searchInput = screen.getByRole('textbox')
    fireEvent.change(searchInput, { target: { value: 'godfather' } })

    await waitFor(() => {
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    })

    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('The Godfather Part II')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenLastCalledWith('/api/Movies?s=godfather&page=2')
  })

  it('clears search results when input is cleared', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ value: [mockSearchResponse] })
    })

    render(<App />)

    const searchInput = screen.getByRole('textbox')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    })

    const clearButton = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearButton)

    expect(searchInput.value).toBe('')
  })

  it('handles network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    const searchInput = screen.getByRole('textbox')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(screen.getByText('Network error occurred')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
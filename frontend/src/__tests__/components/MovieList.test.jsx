import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MovieList from '../../components/MovieList'

const mockMovies = [
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
]

describe('MovieList', () => {
  it('renders grid layout', () => {
    render(<MovieList movies={mockMovies} />)
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('grid')
  })

  it('displays movie items', () => {
    render(<MovieList movies={mockMovies} />)
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
    expect(screen.getByText('The Godfather')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    render(<MovieList loading={true} />)
    expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument()
  })

  it('shows empty state message when no movies', () => {
    render(<MovieList movies={[]} />)
    expect(screen.getByText(/no movies found/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<MovieList error="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('has responsive grid columns', () => {
    render(<MovieList movies={mockMovies} />)
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4')
  })
})
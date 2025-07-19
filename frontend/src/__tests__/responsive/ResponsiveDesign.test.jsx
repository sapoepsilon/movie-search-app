import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
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
  },
  {
    imdbID: 'tt0071562',
    Title: 'The Godfather Part II',
    Year: '1974',
    Type: 'movie',
    Poster: 'https://example.com/poster3.jpg'
  },
  {
    imdbID: 'tt0468569',
    Title: 'The Dark Knight',
    Year: '2008',
    Type: 'movie',
    Poster: 'https://example.com/poster4.jpg'
  }
]

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

describe('Responsive Design', () => {
  let originalInnerWidth

  beforeEach(() => {
    originalInnerWidth = global.innerWidth
  })

  afterEach(() => {
    global.innerWidth = originalInnerWidth
  })

  it('applies mobile grid classes', () => {
    global.innerWidth = 375 // Mobile width
    render(<MovieList movies={mockMovies} />)
    
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('grid-cols-1')
  })

  it('applies tablet grid classes', () => {
    global.innerWidth = 768 // Tablet width
    render(<MovieList movies={mockMovies} />)
    
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('md:grid-cols-2')
  })

  it('applies desktop grid classes', () => {
    global.innerWidth = 1024 // Desktop width
    render(<MovieList movies={mockMovies} />)
    
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('lg:grid-cols-3')
  })

  it('applies large desktop grid classes', () => {
    global.innerWidth = 1280 // Large desktop width
    render(<MovieList movies={mockMovies} />)
    
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('xl:grid-cols-4')
  })

  it('has responsive container classes', () => {
    render(<MovieList movies={mockMovies} />)
    
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2', 
      'lg:grid-cols-3',
      'xl:grid-cols-4',
      'gap-6'
    )
  })

  it('maintains proper spacing on all screen sizes', () => {
    render(<MovieList movies={mockMovies} />)
    
    const grid = screen.getByTestId('movie-grid')
    expect(grid).toHaveClass('gap-6')
  })
})
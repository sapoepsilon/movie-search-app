import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MovieItem from '../../components/MovieItem'

const mockMovie = {
  imdbID: 'tt0111161',
  Title: 'The Shawshank Redemption',
  Year: '1994',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg'
}

const mockMovieNoPoster = {
  imdbID: 'tt0068646',
  Title: 'The Godfather',
  Year: '1972',
  Type: 'movie',
  Poster: 'N/A'
}

describe('MovieItem', () => {
  it('displays poster image', () => {
    render(<MovieItem movie={mockMovie} />)
    const image = screen.getByAltText('The Shawshank Redemption poster')
    expect(image).toHaveAttribute('src', 'https://example.com/poster.jpg')
    expect(image).toHaveAttribute('alt', 'The Shawshank Redemption poster')
  })

  it('shows placeholder for missing poster', () => {
    render(<MovieItem movie={mockMovieNoPoster} />)
    expect(screen.getByTestId('poster-placeholder')).toBeInTheDocument()
  })

  it('displays movie title', () => {
    render(<MovieItem movie={mockMovie} />)
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
  })

  it('displays movie year', () => {
    render(<MovieItem movie={mockMovie} />)
    expect(screen.getByText('1994')).toBeInTheDocument()
  })

  it('displays movie type badge', () => {
    render(<MovieItem movie={mockMovie} />)
    expect(screen.getByText('movie')).toBeInTheDocument()
  })

  it('displays imdb id', () => {
    render(<MovieItem movie={mockMovie} />)
    expect(screen.getByText('tt0111161')).toBeInTheDocument()
  })

  it('has hover effects', () => {
    render(<MovieItem movie={mockMovie} />)
    const card = screen.getByRole('article').querySelector('.hover\\:shadow-lg')
    expect(card).toBeInTheDocument()
  })

  it('has accessibility attributes', () => {
    render(<MovieItem movie={mockMovie} />)
    const card = screen.getByRole('article')
    expect(card).toBeInTheDocument()
  })

  it('displays IMDB link with logo', () => {
    render(<MovieItem movie={mockMovie} />)
    const imdbLink = screen.getByRole('link', { name: /view.*on imdb/i })
    expect(imdbLink).toBeInTheDocument()
    expect(imdbLink).toHaveAttribute('href', 'https://www.imdb.com/title/tt0111161/')
    expect(imdbLink).toHaveAttribute('target', '_blank')
    expect(imdbLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays IMDB logo image', () => {
    render(<MovieItem movie={mockMovie} />)
    const imdbLogo = screen.getByAltText('IMDB')
    expect(imdbLogo).toBeInTheDocument()
  })

  it('displays external link icon', () => {
    render(<MovieItem movie={mockMovie} />)
    const imdbLink = screen.getByRole('link', { name: /view.*on imdb/i })
    expect(imdbLink).toBeInTheDocument()
  })
})
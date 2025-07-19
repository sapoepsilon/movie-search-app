import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MovieItem from '../../components/MovieItem'

describe('MovieItem Image Placeholder', () => {
  it('shows placeholder when poster is N/A', () => {
    const movie = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2024',
      Type: 'movie',
      Poster: 'N/A'
    }

    render(<MovieItem movie={movie} />)
    
    expect(screen.getByTestId('poster-placeholder')).toBeInTheDocument()
    expect(screen.getByText('No Image Available')).toBeInTheDocument()
  })

  it('shows placeholder when poster is empty', () => {
    const movie = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2024',
      Type: 'movie',
      Poster: ''
    }

    render(<MovieItem movie={movie} />)
    
    expect(screen.getByTestId('poster-placeholder')).toBeInTheDocument()
    expect(screen.getByText('No Image Available')).toBeInTheDocument()
  })

  it('shows image when poster URL is valid', () => {
    const movie = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2024',
      Type: 'movie',
      Poster: 'https://example.com/poster.jpg'
    }

    render(<MovieItem movie={movie} />)
    
    expect(screen.getByAltText('Test Movie poster')).toBeInTheDocument()
    expect(screen.queryByTestId('poster-placeholder')).not.toBeInTheDocument()
  })

  it('shows placeholder when image fails to load', () => {
    const movie = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2024',
      Type: 'movie',
      Poster: 'https://example.com/broken-image.jpg'
    }

    render(<MovieItem movie={movie} />)
    
    const image = screen.getByAltText('Test Movie poster')
    fireEvent.error(image)
    
    expect(screen.getByTestId('poster-placeholder')).toBeInTheDocument()
    expect(screen.getByText('No Image Available')).toBeInTheDocument()
  })

  it('placeholder contains film icon', () => {
    const movie = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2024',
      Type: 'movie',
      Poster: 'N/A'
    }

    render(<MovieItem movie={movie} />)
    
    const placeholder = screen.getByTestId('poster-placeholder')
    expect(placeholder).toContainHTML('svg')
  })
})
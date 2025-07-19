import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the header component', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays the search container', () => {
    render(<App />)
    expect(screen.getByTestId('search-container')).toBeInTheDocument()
  })

  it('displays the movie list container', () => {
    render(<App />)
    expect(screen.getByTestId('movie-list-container')).toBeInTheDocument()
  })

  it('has initial empty search state', () => {
    render(<App />)
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })
})
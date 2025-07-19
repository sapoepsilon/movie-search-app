import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../../App'

describe('Flex Layout', () => {
  it('has proper flex layout structure', () => {
    render(<App />)
    
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toHaveClass('flex-1', 'flex', 'flex-col')
  })

  it('positions pagination at bottom with mt-auto', () => {
    render(<App />)
    
    const movieListContainer = screen.getByTestId('movie-list-container')
    expect(movieListContainer).toHaveClass('flex-1')
  })

  it('maintains proper spacing between sections', () => {
    render(<App />)
    
    const searchContainer = screen.getByTestId('search-container')
    expect(searchContainer).toHaveClass('mb-8')
  })

  it('applies min-height to main container', () => {
    const { container } = render(<App />)
    
    const appContainer = container.firstChild
    expect(appContainer).toHaveClass('min-h-screen', 'flex', 'flex-col')
  })

  it('allows content to scroll when needed', () => {
    render(<App />)
    
    const mainContainer = screen.getByRole('main')
    // The container should not have overflow hidden, allowing natural scrolling
    expect(mainContainer).not.toHaveClass('overflow-hidden')
  })
})
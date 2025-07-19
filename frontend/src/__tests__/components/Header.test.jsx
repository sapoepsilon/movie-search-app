import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../../components/Header'

describe('Header', () => {
  it('displays site branding', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Movie Search')
  })

  it('has clean header layout', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays static user display', () => {
    render(<Header />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('has responsive container', () => {
    render(<Header />)
    const container = screen.getByRole('banner')
    expect(container).toHaveClass('border-b')
  })

  it('renders as semantic header element', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
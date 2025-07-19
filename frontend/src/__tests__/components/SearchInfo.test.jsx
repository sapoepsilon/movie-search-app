import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SearchInfo from '../../components/SearchInfo'

describe('SearchInfo', () => {
  it('displays search term', () => {
    render(<SearchInfo searchTerm="star wars" totalResults={20} />)
    expect(screen.getByText(/star wars/i)).toBeInTheDocument()
  })

  it('displays results count', () => {
    render(<SearchInfo searchTerm="batman" totalResults={45} />)
    expect(screen.getByText(/45 results/i)).toBeInTheDocument()
  })

  it('shows pagination info for first page', () => {
    render(<SearchInfo searchTerm="matrix" totalResults={25} currentPage={1} />)
    expect(screen.getByText(/showing 1-10 of 25/i)).toBeInTheDocument()
  })

  it('shows pagination info for middle page', () => {
    render(<SearchInfo searchTerm="lord" totalResults={30} currentPage={2} />)
    expect(screen.getByText(/showing 11-20 of 30/i)).toBeInTheDocument()
  })

  it('shows pagination info for last page', () => {
    render(<SearchInfo searchTerm="spider" totalResults={23} currentPage={3} />)
    expect(screen.getByText(/showing 21-23 of 23/i)).toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    render(<SearchInfo searchTerm="nonexistent" totalResults={0} />)
    expect(screen.getByText(/no results found/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<SearchInfo loading={true} />)
    expect(screen.getByTestId('search-info-loading')).toBeInTheDocument()
  })

  it('does not render when no search term and not loading', () => {
    const { container } = render(<SearchInfo />)
    expect(container.firstChild).toBeNull()
  })
})
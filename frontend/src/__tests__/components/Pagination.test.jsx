import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Pagination from '../../components/Pagination'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('renders current page indicator', () => {
    render(<Pagination currentPage={2} totalResults={50} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows previous button when not on first page', () => {
    render(<Pagination currentPage={2} totalResults={50} onPageChange={mockOnPageChange} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalResults={50} onPageChange={mockOnPageChange} />)
    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()
  })

  it('shows next button when not on last page', () => {
    render(<Pagination currentPage={2} totalResults={50} onPageChange={mockOnPageChange} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalResults={50} onPageChange={mockOnPageChange} />)
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when previous clicked', () => {
    render(<Pagination currentPage={3} totalResults={50} onPageChange={mockOnPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: /previous/i }))
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when next clicked', () => {
    render(<Pagination currentPage={2} totalResults={50} onPageChange={mockOnPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('displays page numbers for small total pages', () => {
    render(<Pagination currentPage={2} totalResults={30} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not render when totalResults is 0', () => {
    const { container } = render(<Pagination currentPage={1} totalResults={0} onPageChange={mockOnPageChange} />)
    expect(container.firstChild).toBeNull()
  })

  it('calculates total pages correctly', () => {
    render(<Pagination currentPage={1} totalResults={95} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
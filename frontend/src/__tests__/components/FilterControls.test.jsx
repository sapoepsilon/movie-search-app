import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FilterControls from '../../components/FilterControls'

describe('FilterControls', () => {
  const mockOnTypeChange = vi.fn()

  beforeEach(() => {
    mockOnTypeChange.mockClear()
  })

  it('renders all filter buttons', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    expect(screen.getByTestId('filter-all')).toBeInTheDocument()
    expect(screen.getByTestId('filter-movie')).toBeInTheDocument()
    expect(screen.getByTestId('filter-series')).toBeInTheDocument()
    expect(screen.getByTestId('filter-episode')).toBeInTheDocument()
  })

  it('highlights selected filter', () => {
    render(<FilterControls selectedType="movie" onTypeChange={mockOnTypeChange} />)
    
    const movieButton = screen.getByTestId('filter-movie')
    const allButton = screen.getByTestId('filter-all')
    
    expect(movieButton).toHaveClass('bg-primary')
    expect(allButton).not.toHaveClass('bg-primary')
  })

  it('calls onTypeChange when filter is clicked', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    const movieButton = screen.getByTestId('filter-movie')
    fireEvent.click(movieButton)
    
    expect(mockOnTypeChange).toHaveBeenCalledWith('movie')
  })

  it('handles empty string for "All" filter', () => {
    render(<FilterControls selectedType="movie" onTypeChange={mockOnTypeChange} />)
    
    const allButton = screen.getByTestId('filter-all')
    fireEvent.click(allButton)
    
    expect(mockOnTypeChange).toHaveBeenCalledWith('')
  })

  it('shows correct button text', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
    expect(screen.getByText('Series')).toBeInTheDocument()
    expect(screen.getByText('Episodes')).toBeInTheDocument()
  })
})
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FilterControls from '../../components/FilterControls'

describe('FilterControls', () => {
  const mockOnTypeChange = vi.fn()

  beforeEach(() => {
    mockOnTypeChange.mockClear()
  })

  it('renders filter dropdown trigger', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    expect(screen.getByTestId('type-filter-trigger')).toBeInTheDocument()
    expect(screen.getByText('All Types')).toBeInTheDocument()
  })

  it('shows selected filter in trigger', () => {
    render(<FilterControls selectedType="movie" onTypeChange={mockOnTypeChange} />)
    
    expect(screen.getByText('Movies')).toBeInTheDocument()
  })

  it('opens dropdown when trigger is clicked', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    const trigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(trigger)
    
    expect(screen.getByTestId('filter-all')).toBeInTheDocument()
    expect(screen.getByTestId('filter-movie')).toBeInTheDocument()
    expect(screen.getByTestId('filter-series')).toBeInTheDocument()
    expect(screen.getByTestId('filter-episode')).toBeInTheDocument()
  })

  it('calls onTypeChange when dropdown item is clicked', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    const trigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(trigger)
    
    const movieOption = screen.getByTestId('filter-movie')
    fireEvent.click(movieOption)
    
    expect(mockOnTypeChange).toHaveBeenCalledWith('movie')
  })

  it('handles empty string for "All Types" filter', () => {
    render(<FilterControls selectedType="movie" onTypeChange={mockOnTypeChange} />)
    
    const trigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(trigger)
    
    const allOption = screen.getByTestId('filter-all')
    fireEvent.click(allOption)
    
    expect(mockOnTypeChange).toHaveBeenCalledWith('')
  })

  it('shows correct dropdown options', () => {
    render(<FilterControls selectedType="" onTypeChange={mockOnTypeChange} />)
    
    const trigger = screen.getByTestId('type-filter-trigger')
    fireEvent.click(trigger)
    
    expect(screen.getByTestId('filter-all')).toBeInTheDocument()
    expect(screen.getByTestId('filter-movie')).toBeInTheDocument()
    expect(screen.getByTestId('filter-series')).toBeInTheDocument()
    expect(screen.getByTestId('filter-episode')).toBeInTheDocument()
  })
})
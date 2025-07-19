import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchBox from '../../components/SearchBox'

describe('SearchBox', () => {
  it('renders input field', () => {
    render(<SearchBox onSearch={() => {}} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<SearchBox onSearch={() => {}} />)
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument()
  })

  it('calls onSearch with debounced input', async () => {
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'star wars' } })
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('star wars')
    }, { timeout: 400 })
  })

  it('shows clear button when input has value', () => {
    render(<SearchBox onSearch={() => {}} />)
    const input = screen.getByRole('searchbox')
    
    fireEvent.change(input, { target: { value: 'test' } })
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('clears input when clear button clicked', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)
    const input = screen.getByRole('searchbox')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    
    expect(input.value).toBe('')
  })

  it('triggers search on Enter key', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBox onSearch={mockOnSearch} />)
    const input = screen.getByRole('searchbox')
    
    fireEvent.change(input, { target: { value: 'matrix' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(mockOnSearch).toHaveBeenCalledWith('matrix')
  })

  it('shows loading state', () => {
    render(<SearchBox onSearch={() => {}} loading={true} />)
    expect(screen.getByTestId('search-loading')).toBeInTheDocument()
  })
})
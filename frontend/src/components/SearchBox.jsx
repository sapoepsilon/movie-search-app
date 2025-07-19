import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'

function SearchBox({ onSearch, loading = false }) {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  useEffect(() => {
    if (debouncedValue.trim()) {
      onSearch(debouncedValue.trim())
    }
  }, [debouncedValue, onSearch])

  const handleClear = () => {
    setValue('')
    setDebouncedValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value.trim())
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search movies..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-8"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {loading && (
        <div data-testid="search-loading">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  )
}

export default SearchBox
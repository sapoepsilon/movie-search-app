import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

function FilterControls({ selectedType, onTypeChange }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const types = [
    { value: '', label: 'All Types' },
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'Series' },
    { value: 'episode', label: 'Episodes' }
  ]

  const currentType = types.find(type => type.value === selectedType) || types[0]

  const handleSelect = (value) => {
    onTypeChange(value)
    setIsOpen(false)
  }

  return (
    <Select className="w-full">
      <SelectTrigger
        onClick={() => setIsOpen(!isOpen)}
        data-testid="type-filter-trigger"
        className="h-9"
      >
        <SelectValue placeholder={currentType.label} />
      </SelectTrigger>
      {isOpen && (
        <SelectContent className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg">
          {types.map((type) => (
            <SelectItem
              key={type.value}
              selected={selectedType === type.value}
              onClick={() => handleSelect(type.value)}
              data-testid={`filter-${type.value || 'all'}`}
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  )
}

export default FilterControls
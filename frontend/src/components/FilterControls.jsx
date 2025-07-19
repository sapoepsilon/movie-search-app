import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function FilterControls({ selectedType, onTypeChange }) {
  const types = [
    { value: '', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'Series' },
    { value: 'episode', label: 'Episodes' }
  ]

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground flex items-center mr-4">
            Filter by type:
          </span>
          {types.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChange(type.value)}
              data-testid={`filter-${type.value || 'all'}`}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterControls
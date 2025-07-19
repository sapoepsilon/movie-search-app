import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

function SearchInfo({ searchTerm, totalResults = 0, currentPage = 1, loading = false }) {
  if (loading) {
    return (
      <div data-testid="search-info-loading">
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (!searchTerm && !loading) {
    return null
  }

  if (totalResults === 0) {
    return (
      <Alert>
        <AlertDescription>
          No results found for "{searchTerm}". Try a different search term.
        </AlertDescription>
      </Alert>
    )
  }

  const pageSize = 10
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalResults)

  return (
    <Alert>
      <AlertDescription>
        Search results for "{searchTerm}" - {totalResults} results found.
        Showing {startIndex}-{endIndex} of {totalResults}.
      </AlertDescription>
    </Alert>
  )
}

export default SearchInfo
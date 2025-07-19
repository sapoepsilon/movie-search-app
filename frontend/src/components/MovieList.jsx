import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import MovieItem from './MovieItem'

function MovieList({ movies = [], loading = false, error = null }) {
  if (loading) {
    return (
      <div data-testid="skeleton-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg border bg-card">
            <div className="aspect-[3/4] relative">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="px-4 pb-4">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-48">
        <p className="text-muted-foreground">No movies found. Try a different search term.</p>
      </div>
    )
  }

  return (
    <div 
      data-testid="movie-grid" 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
    >
      {movies.map((movie) => (
        <MovieItem key={movie.imdbID} movie={movie} />
      ))}
    </div>
  )
}

export default MovieList
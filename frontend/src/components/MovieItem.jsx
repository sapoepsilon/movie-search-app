import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Film, ExternalLink } from 'lucide-react'
import imdbLogo from '../assets/imdb-logo.svg'

function MovieItem({ movie }) {
  const [imageError, setImageError] = useState(false)
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError
  const imdbUrl = `https://www.imdb.com/title/${movie.imdbID}/`

  return (
    <article role="article">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
        <div className="aspect-[3/4] relative bg-muted">
          {hasPoster ? (
            <img
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              data-testid="poster-placeholder"
              className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground"
            >
              <Film className="h-12 w-12 mb-2" />
              <span className="text-xs text-center px-2">No Image Available</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {movie.Title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>{movie.Year}</span>
            <Badge variant="secondary" className="text-xs">
              {movie.Type}
            </Badge>
          </div>
          
          <div className="mt-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full h-8"
            >
              <a
                href={imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${movie.Title} on IMDB`}
              >
                <img 
                  src={imdbLogo} 
                  alt="IMDB" 
                  className="h-4 w-8 mr-2"
                />
                View on IMDB
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-xs text-muted-foreground font-mono">
            {movie.imdbID}
          </p>
        </CardFooter>
      </Card>
    </article>
  )
}

export default MovieItem
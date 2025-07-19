import cds from '@sap/cds'

export default cds.service.impl(async function() {
  const { Movies } = this.entities

  this.before('CREATE', 'Movies', async (req) => {
    const movie = req.data
    
    if (!movie.imdbID) {
      req.error(400, 'imdbID is required')
    }
    
    if (!movie.Title) {
      req.error(400, 'Title is required')
    }

    const existing = await SELECT.one.from(Movies).where({ imdbID: movie.imdbID })
    if (existing) {
      req.error(409, `Movie with imdbID ${movie.imdbID} already exists`)
    }

    movie.searchTerms = generateSearchTerms(movie)
  })

  this.before('UPDATE', 'Movies', async (req) => {
    const movie = req.data
    
    if (movie.imdbID) {
      const existing = await SELECT.one.from(Movies).where`imdbID = ${movie.imdbID} AND ID != ${req.params[0]}`
      if (existing) {
        req.error(409, `Movie with imdbID ${movie.imdbID} already exists`)
      }
    }

    if (movie.Title || movie.Director || movie.Actors || movie.Genre) {
      const currentMovie = await SELECT.one.from(Movies).where`ID = ${req.params[0]}`
      if (currentMovie) {
        const updatedMovie = { ...currentMovie, ...movie }
        movie.searchTerms = generateSearchTerms(updatedMovie)
      }
    }
  })

  this.on('importMovies', async (req) => {
    const { movies } = req.data
    const results = []

    for (const movieData of movies) {
      try {
        if (!movieData.imdbID || !movieData.Title) {
          results.push({
            imdbID: movieData.imdbID || 'unknown',
            success: false,
            message: 'imdbID and Title are required'
          })
          continue
        }

        const existing = await SELECT.one.from(Movies).where({ imdbID: movieData.imdbID })
        if (existing) {
          results.push({
            imdbID: movieData.imdbID,
            success: false,
            message: 'Movie already exists'
          })
          continue
        }

        movieData.searchTerms = generateSearchTerms(movieData)
        await INSERT.into(Movies).entries(movieData)
        
        results.push({
          imdbID: movieData.imdbID,
          success: true,
          message: 'Movie imported successfully'
        })
      } catch (error) {
        results.push({
          imdbID: movieData.imdbID,
          success: false,
          message: error.message
        })
      }
    }

    return results
  })

  function generateSearchTerms(movie) {
    const terms = []
    
    if (movie.Title) terms.push(movie.Title)
    if (movie.Director) terms.push(movie.Director)
    if (movie.Actors) terms.push(movie.Actors)
    if (movie.Genre) terms.push(movie.Genre)
    if (movie.Year) terms.push(movie.Year)
    if (movie.imdbID) terms.push(movie.imdbID)
    
    return terms.join(' ').toLowerCase()
  }
})
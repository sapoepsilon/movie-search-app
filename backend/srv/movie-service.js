import cds from '@sap/cds'

export default cds.service.impl(async function () {
  const { Movies } = this.entities

  this.on('READ', 'Movies', async (req) => {
    return SELECT.from(Movies)
  })

  this.on('GET', '/api/movies', async (req) => {
    const { s: searchTerm, i: imdbID, page = 1, type } = req.query

    if (imdbID) {
      if (!imdbID.match(/^tt\d+$/)) {
        req.reject(400, { Response: 'False', Error: 'Invalid IMDb ID.' })
        return
      }

      const movie = await SELECT.one.from(Movies).where({ imdbID })
      
      if (!movie) {
        req.reject(404, { Response: 'False', Error: 'Movie not found!' })
        return
      }

      return {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster,
        Plot: movie.Plot,
        Director: movie.Director,
        Actors: movie.Actors,
        Genre: movie.Genre,
        Runtime: movie.Runtime,
        Rated: movie.Rated,
        Released: movie.Released,
        imdbRating: movie.imdbRating,
        Response: 'True'
      }
    }

    if (!searchTerm) {
      req.reject(400, { Response: 'False', Error: 'Parameter \'s\' is required.' })
      return
    }

    if (type && !['movie', 'series', 'episode'].includes(type)) {
      req.reject(400, { Response: 'False', Error: 'Invalid type parameter.' })
      return
    }

    const pageSize = 10
    const offset = (parseInt(page) - 1) * pageSize

    let whereClause = {
      or: [
        { Title: { like: `%${searchTerm}%` } },
        { searchTerms: { like: `%${searchTerm.toLowerCase()}%` } }
      ]
    }

    if (type) {
      whereClause = { and: [whereClause, { Type: type }] }
    }

    const totalCount = await SELECT.from(Movies).where(whereClause).columns('count(*) as count')
    const total = totalCount[0].count

    if (total === 0) {
      return { Response: 'False', Error: 'Movie not found!' }
    }

    const movies = await SELECT.from(Movies)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset)

    const searchResults = movies.map(movie => ({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Type: movie.Type,
      Poster: movie.Poster
    }))

    return {
      Search: searchResults,
      totalResults: total.toString(),
      Response: 'True'
    }
  })
})
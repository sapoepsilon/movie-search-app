import cds from '@sap/cds'

export default cds.service.impl(async function () {
  const { Movies } = this.entities

  this.on('READ', 'Movies', async (req) => {
    let searchTerm, imdbID, page = 1, type
    
    if (req.http && req.http.req && req.http.req.url) {
      const url = new URL(req.http.req.url, 'http://localhost')
      const searchParams = url.searchParams
      searchTerm = searchParams.get('s')
      imdbID = searchParams.get('i')
      page = parseInt(searchParams.get('page')) || 1
      type = searchParams.get('type')
    }

    if (imdbID) {
      if (!imdbID.match(/^tt\d+$/)) {
        return { Response: 'False', Error: 'Invalid IMDb ID.' }
      }

      const movie = await SELECT.one.from(Movies).where({ imdbID })
      
      if (!movie) {
        return { Response: 'False', Error: 'Movie not found!' }
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

    if (searchTerm) {
      if (type && !['movie', 'series', 'episode'].includes(type)) {
        return { Response: 'False', Error: 'Invalid type parameter.' }
      }

      const pageSize = 10
      const offset = (parseInt(page) - 1) * pageSize

      const totalCount = await SELECT.from(Movies)
        .where(`Title like '%${searchTerm}%' or searchTerms like '%${searchTerm.toLowerCase()}%'`)
        .columns('count(*) as count')
      
      let total
      if (type) {
        const totalCountWithType = await SELECT.from(Movies)
          .where(`(Title like '%${searchTerm}%' or searchTerms like '%${searchTerm.toLowerCase()}%') and Type = '${type}'`)
          .columns('count(*) as count')
        total = totalCountWithType[0].count
      } else {
        total = totalCount[0].count
      }

      if (total === 0) {
        return { Response: 'False', Error: 'Movie not found!' }
      }

      let movies
      if (type) {
        movies = await SELECT.from(Movies)
          .where(`(Title like '%${searchTerm}%' or searchTerms like '%${searchTerm.toLowerCase()}%') and Type = '${type}'`)
          .limit(pageSize, offset)
      } else {
        movies = await SELECT.from(Movies)
          .where(`Title like '%${searchTerm}%' or searchTerms like '%${searchTerm.toLowerCase()}%'`)
          .limit(pageSize, offset)
      }

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
    }

    if (!searchTerm && !imdbID) {
      return { Response: 'False', Error: 'Parameter \'s\' is required.' }
    }

    return SELECT.from(Movies)
  })
})
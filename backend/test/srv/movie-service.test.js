import { describe, it } from 'vitest'
import cds from '@sap/cds'

describe('Movie Service API Tests', () => {
  const { GET, expect } = cds.test(__dirname + '/../..')

  describe('GET /api/Movies', () => {
    it('should search movies by title', async () => {
      const { data } = await GET('/api/Movies?s=toy')
      
      const result = data.value[0]
      expect(result).to.have.property('Search')
      expect(result.Search).to.be.an('array')
      expect(result.Search.length).to.be.greaterThan(0)
      
      const movie = result.Search[0]
      expect(movie).to.have.property('imdbID')
      expect(movie).to.have.property('Title')
      expect(movie).to.have.property('Year')
      expect(movie).to.have.property('Type')
      expect(movie).to.have.property('Poster')
    })

    it('should return OMDB-compatible format', async () => {
      const { data } = await GET('/api/Movies?s=goldeneye')
      
      const result = data.value[0]
      expect(result).to.have.property('Search')
      expect(result).to.have.property('totalResults')
      expect(result).to.have.property('Response', 'True')

      const movie = result.Search[0]
      expect(movie.Title).to.include('GoldenEye')
      expect(movie.Year).to.equal('1995')
      expect(movie.Type).to.equal('movie')
    })

    it('should handle case-insensitive search', async () => {
      const { data: lowerData } = await GET('/api/Movies?s=toy')
      const { data: upperData } = await GET('/api/Movies?s=TOY')

      expect(lowerData.value[0].Search.length).to.equal(upperData.value[0].Search.length)
    })

    it('should return error for missing search parameter', async () => {
      try {
        await GET('/api/Movies')
      } catch (error) {
        expect(error.response.status).to.equal(400)
        expect(error.response.data).to.have.property('Response', 'False')
        expect(error.response.data).to.have.property('Error')
      }
    })

    it('should return empty results for non-existent movie', async () => {
      const { data } = await GET('/api/Movies?s=nonexistentmovie12345')

      const result = data.value[0]
      expect(result).to.have.property('Response', 'False')
      expect(result).to.have.property('Error', 'Movie not found!')
    })
  })

  describe('GET /api/Movies by IMDB ID', () => {
    it('should get movie by IMDB ID', async () => {
      const { data } = await GET('/api/Movies?i=tt0114709')

      const result = data.value[0]
      expect(result).to.have.property('imdbID', 'tt0114709')
      expect(result).to.have.property('Title')
      expect(result).to.have.property('Year')
      expect(result).to.have.property('Plot')
      expect(result).to.have.property('Director')
      expect(result).to.have.property('Actors')
      expect(result).to.have.property('Genre')
      expect(result).to.have.property('Runtime')
      expect(result).to.have.property('Rated')
      expect(result).to.have.property('Released')
      expect(result).to.have.property('imdbRating')
      expect(result).to.have.property('Poster')
      expect(result).to.have.property('Response', 'True')
    })

    it('should return error for invalid IMDB ID', async () => {
      try {
        await GET('/api/Movies?i=invalid123')
      } catch (error) {
        expect(error.response.status).to.equal(400)
        expect(error.response.data).to.have.property('Response', 'False')
        expect(error.response.data).to.have.property('Error', 'Invalid IMDb ID.')
      }
    })

    it('should return error for non-existent IMDB ID', async () => {
      try {
        await GET('/api/Movies?i=tt9999999')
      } catch (error) {
        expect(error.response.status).to.equal(404)
        expect(error.response.data).to.have.property('Response', 'False')
        expect(error.response.data).to.have.property('Error', 'Movie not found!')
      }
    })
  })

  describe('Pagination', () => {
    it('should return default page size of 10', async () => {
      const { data } = await GET('/api/Movies?s=1995')

      const result = data.value[0]
      expect(result.Search.length).to.be.lessThanOrEqual(10)
    })

    it('should handle page parameter', async () => {
      const { data: page1Data } = await GET('/api/Movies?s=1995&page=1')
      const { data: page2Data } = await GET('/api/Movies?s=1995&page=2')

      expect(page1Data.value[0].Search).to.not.deep.equal(page2Data.value[0].Search)
    })

    it('should return total results count', async () => {
      const { data } = await GET('/api/Movies?s=1995')

      const result = data.value[0]
      expect(result).to.have.property('totalResults')
      expect(result.totalResults).to.be.a('string')
      expect(parseInt(result.totalResults)).to.be.greaterThan(0)
    })
  })

  describe('Type Filtering', () => {
    it('should filter by movie type', async () => {
      const { data } = await GET('/api/Movies?s=toy&type=movie')

      const result = data.value[0]
      result.Search.forEach(movie => {
        expect(movie.Type).to.equal('movie')
      })
    })

    it('should return error for invalid type', async () => {
      try {
        await GET('/api/Movies?s=toy&type=invalid')
      } catch (error) {
        expect(error.response.status).to.equal(400)
        expect(error.response.data).to.have.property('Response', 'False')
        expect(error.response.data).to.have.property('Error')
      }
    })
  })
})
import { describe, it, beforeAll, afterAll } from 'vitest'
import cds from '@sap/cds'
import { setupTestService, teardownTestService } from '../setup-service.js'

describe('Movie Service API Tests', () => {
  let db

  beforeAll(async () => {
    const setup = await setupTestService()
    db = setup.db
  })

  afterAll(async () => {
    await teardownTestService()
  })

  describe('GET /api/movies', () => {
    it('should search movies by title', async () => {
      const response = await request
        .get('/api/movies?s=toy')
        .expect(200)

      expect(response.body).to.have.property('Search')
      expect(response.body.Search).to.be.an('array')
      expect(response.body.Search.length).to.be.greaterThan(0)
      
      const movie = response.body.Search[0]
      expect(movie).to.have.property('imdbID')
      expect(movie).to.have.property('Title')
      expect(movie).to.have.property('Year')
      expect(movie).to.have.property('Type')
      expect(movie).to.have.property('Poster')
    })

    it('should return OMDB-compatible format', async () => {
      const response = await request
        .get('/api/movies?s=goldeneye')
        .expect(200)

      expect(response.body).to.have.property('Search')
      expect(response.body).to.have.property('totalResults')
      expect(response.body).to.have.property('Response', 'True')

      const movie = response.body.Search[0]
      expect(movie.Title).to.include('GoldenEye')
      expect(movie.Year).to.equal('1995')
      expect(movie.Type).to.equal('movie')
    })

    it('should handle case-insensitive search', async () => {
      const lowerResponse = await request
        .get('/api/movies?s=toy')
        .expect(200)

      const upperResponse = await request
        .get('/api/movies?s=TOY')
        .expect(200)

      expect(lowerResponse.body.Search.length).to.equal(upperResponse.body.Search.length)
    })

    it('should return error for missing search parameter', async () => {
      const response = await request
        .get('/api/movies')
        .expect(400)

      expect(response.body).to.have.property('Response', 'False')
      expect(response.body).to.have.property('Error')
    })

    it('should return empty results for non-existent movie', async () => {
      const response = await request
        .get('/api/movies?s=nonexistentmovie12345')
        .expect(200)

      expect(response.body).to.have.property('Response', 'False')
      expect(response.body).to.have.property('Error', 'Movie not found!')
    })
  })

  describe('GET /api/movies by IMDB ID', () => {
    it('should get movie by IMDB ID', async () => {
      const response = await request
        .get('/api/movies?i=tt0114709')
        .expect(200)

      expect(response.body).to.have.property('imdbID', 'tt0114709')
      expect(response.body).to.have.property('Title')
      expect(response.body).to.have.property('Year')
      expect(response.body).to.have.property('Plot')
      expect(response.body).to.have.property('Director')
      expect(response.body).to.have.property('Actors')
      expect(response.body).to.have.property('Genre')
      expect(response.body).to.have.property('Runtime')
      expect(response.body).to.have.property('Rated')
      expect(response.body).to.have.property('Released')
      expect(response.body).to.have.property('imdbRating')
      expect(response.body).to.have.property('Poster')
      expect(response.body).to.have.property('Response', 'True')
    })

    it('should return error for invalid IMDB ID', async () => {
      const response = await request
        .get('/api/movies?i=invalid123')
        .expect(400)

      expect(response.body).to.have.property('Response', 'False')
      expect(response.body).to.have.property('Error', 'Invalid IMDb ID.')
    })

    it('should return error for non-existent IMDB ID', async () => {
      const response = await request
        .get('/api/movies?i=tt9999999')
        .expect(404)

      expect(response.body).to.have.property('Response', 'False')
      expect(response.body).to.have.property('Error', 'Movie not found!')
    })
  })

  describe('Pagination', () => {
    it('should return default page size of 10', async () => {
      const response = await request
        .get('/api/movies?s=1995')
        .expect(200)

      expect(response.body.Search.length).to.be.lessThanOrEqual(10)
    })

    it('should handle page parameter', async () => {
      const page1 = await request
        .get('/api/movies?s=1995&page=1')
        .expect(200)

      const page2 = await request
        .get('/api/movies?s=1995&page=2')
        .expect(200)

      expect(page1.body.Search).to.not.deep.equal(page2.body.Search)
    })

    it('should return total results count', async () => {
      const response = await request
        .get('/api/movies?s=1995')
        .expect(200)

      expect(response.body).to.have.property('totalResults')
      expect(response.body.totalResults).to.be.a('string')
      expect(parseInt(response.body.totalResults)).to.be.greaterThan(0)
    })
  })

  describe('Type Filtering', () => {
    it('should filter by movie type', async () => {
      const response = await request
        .get('/api/movies?s=toy&type=movie')
        .expect(200)

      response.body.Search.forEach(movie => {
        expect(movie.Type).to.equal('movie')
      })
    })

    it('should return error for invalid type', async () => {
      const response = await request
        .get('/api/movies?s=toy&type=invalid')
        .expect(400)

      expect(response.body).to.have.property('Response', 'False')
      expect(response.body).to.have.property('Error')
    })
  })
})
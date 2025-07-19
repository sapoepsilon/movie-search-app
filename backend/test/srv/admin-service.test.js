import { describe, it, beforeEach, afterEach } from 'vitest'
import cds from '@sap/cds'

describe('Admin Service Tests', () => {
  const { GET, POST, PATCH, DELETE, expect } = cds.test(__dirname + '/../..')
  
  const originalApiKeys = process.env.API_KEYS
  const validHeaders = { 'x-api-key': 'test-key-123' }
  
  beforeEach(() => {
    process.env.API_KEYS = 'test-key-123,test-key-456'
  })
  
  afterEach(() => {
    if (originalApiKeys) {
      process.env.API_KEYS = originalApiKeys
    } else {
      delete process.env.API_KEYS
    }
  })

  describe('CRUD Operations', () => {
    const createTestMovie = (suffix = '') => ({
      imdbID: `tt${Math.random().toString().slice(2, 10)}${suffix}`,
      Title: `Test Movie${suffix}`,
      Year: '2024',
      Type: 'movie',
      Plot: 'A test movie for testing purposes',
      Director: 'Test Director',
      Actors: 'Test Actor 1, Test Actor 2',
      Genre: 'Action, Drama',
      Runtime: '120 min',
      Rated: 'PG-13',
      Released: '01 Jan 2024',
      imdbRating: '8.5',
      Poster: 'https://example.com/test-poster.jpg'
    })

    describe('CREATE Operations', () => {
      it('should create a new movie with valid data', async () => {
        const testMovie = createTestMovie()
        const { data } = await POST('/admin/Movies', testMovie, {
          headers: validHeaders
        })
        
        expect(data).to.have.property('ID')
        expect(data.imdbID).to.equal(testMovie.imdbID)
        expect(data.Title).to.equal(testMovie.Title)
        expect(data.searchTerms).to.include(testMovie.Title.toLowerCase())
      })

      it('should reject movie creation without imdbID', async () => {
        const testMovie = createTestMovie()
        const invalidMovie = { ...testMovie }
        delete invalidMovie.imdbID
        
        try {
          await POST('/admin/Movies', invalidMovie, {
            headers: validHeaders
          })
          expect.fail('Should have thrown an error')
        } catch (error) {
          expect(error.response.status).to.equal(400)
          expect(error.response.data.error.message).to.include('imdbID is required')
        }
      })

      it('should reject movie creation without Title', async () => {
        const testMovie = createTestMovie()
        const invalidMovie = { ...testMovie }
        delete invalidMovie.Title
        
        try {
          await POST('/admin/Movies', invalidMovie, {
            headers: validHeaders
          })
          expect.fail('Should have thrown an error')
        } catch (error) {
          expect(error.response.status).to.equal(400)
          expect(error.response.data.error.message).to.include('Title is required')
        }
      })

      it('should reject duplicate imdbID', async () => {
        const testMovie = createTestMovie()
        await POST('/admin/Movies', testMovie, {
          headers: validHeaders
        })
        
        try {
          await POST('/admin/Movies', { ...testMovie, Title: 'Different Title' }, {
            headers: validHeaders
          })
          expect.fail('Should have thrown an error')
        } catch (error) {
          expect(error.response.status).to.equal(409)
          expect(error.response.data.error.message).to.include('already exists')
        }
      })
    })

    describe('READ Operations', () => {
      it('should list all movies', async () => {
        const testMovie = createTestMovie()
        await POST('/admin/Movies', testMovie, {
          headers: validHeaders
        })
        
        const { data } = await GET('/admin/Movies', {
          headers: validHeaders
        })
        
        expect(data.value).to.be.an('array')
        expect(data.value.length).to.be.greaterThan(0)
        const createdMovie = data.value.find(m => m.imdbID === testMovie.imdbID)
        expect(createdMovie).to.exist
      })

      it('should get specific movie by ID', async () => {
        const testMovie = createTestMovie()
        const created = await POST('/admin/Movies', testMovie, {
          headers: validHeaders
        })
        
        const { data } = await GET(`/admin/Movies(${created.data.ID})`, {
          headers: validHeaders
        })
        
        expect(data.imdbID).to.equal(testMovie.imdbID)
        expect(data.Title).to.equal(testMovie.Title)
      })
    })

    describe('UPDATE Operations', () => {
      it('should update movie data', async () => {
        const testMovie = createTestMovie()
        const created = await POST('/admin/Movies', testMovie, {
          headers: validHeaders
        })
        
        const updates = {
          Title: 'Updated Test Movie',
          Year: '2025'
        }
        
        const { data } = await PATCH(`/admin/Movies(${created.data.ID})`, updates, {
          headers: validHeaders
        })
        
        expect(data.Title).to.equal(updates.Title)
        expect(data.Year).to.equal(updates.Year)
        expect(data.searchTerms).to.include(updates.Title.toLowerCase())
      })

      it('should reject update with duplicate imdbID', async () => {
        const movie1 = createTestMovie('1')
        const movie1Created = await POST('/admin/Movies', movie1, {
          headers: validHeaders
        })
        
        const movie2 = createTestMovie('2')
        const movie2Created = await POST('/admin/Movies', movie2, {
          headers: validHeaders
        })
        
        try {
          await PATCH(`/admin/Movies(${movie2Created.data.ID})`, {
            imdbID: movie1.imdbID
          }, {
            headers: validHeaders
          })
          expect.fail('Should have thrown an error')
        } catch (error) {
          expect(error.response.status).to.equal(409)
          expect(error.response.data.error.message).to.include('already exists')
        }
      })
    })

    describe('DELETE Operations', () => {
      it('should delete a movie', async () => {
        const testMovie = createTestMovie()
        const created = await POST('/admin/Movies', testMovie, {
          headers: validHeaders
        })
        
        await DELETE(`/admin/Movies(${created.data.ID})`, {
          headers: validHeaders
        })
        
        try {
          await GET(`/admin/Movies(${created.data.ID})`, {
            headers: validHeaders
          })
          expect.fail('Should have thrown an error')
        } catch (error) {
          expect(error.response.status).to.equal(404)
        }
      })
    })
  })

  describe('Batch Import Operations', () => {
    const createMoviesBatch = () => [
      {
        imdbID: `tt${Math.random().toString().slice(2, 10)}1`,
        Title: 'Batch Movie 1',
        Year: '2024',
        Type: 'movie',
        Plot: 'First batch movie'
      },
      {
        imdbID: `tt${Math.random().toString().slice(2, 10)}2`,
        Title: 'Batch Movie 2',
        Year: '2024',
        Type: 'series',
        Plot: 'Second batch movie'
      }
    ]

    it('should import multiple movies successfully', async () => {
      const moviesBatch = createMoviesBatch()
      const { data } = await POST('/admin/importMovies', {
        movies: moviesBatch
      }, {
        headers: validHeaders
      })
      
      expect(data.value).to.be.an('array')
      expect(data.value).to.have.length(2)
      
      data.value.forEach(result => {
        expect(result.success).to.be.true
        expect(result.message).to.equal('Movie imported successfully')
      })
    })

    it('should handle mixed success/failure in batch import', async () => {
      const moviesBatch = createMoviesBatch()
      const mixedBatch = [
        moviesBatch[0],
        {
          imdbID: '',
          Title: 'Invalid Movie'
        },
        moviesBatch[1]
      ]
      
      const { data } = await POST('/admin/importMovies', {
        movies: mixedBatch
      }, {
        headers: validHeaders
      })
      
      expect(data.value).to.have.length(3)
      expect(data.value[0].success).to.be.true
      expect(data.value[1].success).to.be.false
      expect(data.value[1].message).to.include('required')
      expect(data.value[2].success).to.be.true
    })

    it('should reject duplicate movies in batch import', async () => {
      const existingMovie = {
        imdbID: `tt${Math.random().toString().slice(2, 10)}ex`,
        Title: 'Existing Movie',
        Year: '2023',
        Type: 'movie'
      }
      
      await POST('/admin/Movies', existingMovie, {
        headers: validHeaders
      })
      
      const moviesBatch = [
        { ...existingMovie, Title: 'Different Title' },
        createMoviesBatch()[1]
      ]
      
      const { data } = await POST('/admin/importMovies', {
        movies: moviesBatch
      }, {
        headers: validHeaders
      })
      
      expect(data.value[0].success).to.be.false
      expect(data.value[0].message).to.include('already exists')
      expect(data.value[1].success).to.be.true
    })
  })

  describe('Search Terms Generation', () => {
    it('should generate comprehensive search terms', async () => {
      const movieWithDetails = {
        imdbID: `tt${Math.random().toString().slice(2, 10)}se`,
        Title: 'Search Test Movie',
        Year: '2024',
        Type: 'movie',
        Director: 'Search Director',
        Actors: 'Actor One, Actor Two',
        Genre: 'Action, Comedy'
      }
      
      const { data } = await POST('/admin/Movies', movieWithDetails, {
        headers: validHeaders
      })
      
      expect(data.searchTerms).to.include('search test movie')
      expect(data.searchTerms).to.include('search director')
      expect(data.searchTerms).to.include('actor one, actor two')
      expect(data.searchTerms).to.include('action, comedy')
      expect(data.searchTerms).to.include('2024')
      expect(data.searchTerms).to.include(movieWithDetails.imdbID)
    })
  })
})
import { describe, it, beforeAll, afterAll } from 'vitest'
import cds from '@sap/cds'

describe('Basic Service Tests', () => {
  let db

  beforeAll(async () => {
    const model = await cds.load(['db/schema.cds', 'srv/movie-service.cds'])
    db = await cds.deploy(model).to('sqlite::memory:')
  })

  afterAll(async () => {
    await cds.shutdown()
  })

  it('should load movies from CSV data', async () => {
    const { Movies } = cds.entities('sap.capire.movies')
    
    const movies = await SELECT.from(Movies).limit(5)
    
    expect(movies).to.be.an('array')
    expect(movies.length).to.be.greaterThan(0)
    expect(movies[0]).to.have.property('Title')
    expect(movies[0]).to.have.property('imdbID')
    expect(movies[0]).to.have.property('Year')
  })

  it('should find specific movie by title search', async () => {
    const { Movies } = cds.entities('sap.capire.movies')
    
    const movies = await SELECT.from(Movies).where({
      Title: { like: '%Toy%' }
    })
    
    expect(movies).to.be.an('array')
    expect(movies.length).to.be.greaterThan(0)
    expect(movies[0].Title).to.include('Toy')
  })

  it('should find movie by IMDB ID', async () => {
    const { Movies } = cds.entities('sap.capire.movies')
    
    const movie = await SELECT.one.from(Movies).where({
      imdbID: 'tt0114709'
    })
    
    expect(movie).to.exist
    expect(movie.imdbID).to.equal('tt0114709')
    expect(movie.Title).to.equal('Toy Story')
  })
})
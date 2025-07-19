import { describe, it, beforeAll } from 'vitest'
import cds from '@sap/cds'

describe('Data Model Tests', () => {
  let model

  beforeAll(async () => {
    model = await cds.load('db/schema.cds')
  })

  describe('Movies Entity', () => {
    it('should have Movies entity defined', () => {
      const Movies = model.definitions['sap.capire.movies.Movies']
      expect(Movies).to.exist
      expect(Movies.kind).to.equal('entity')
    })

    it('should have all required OMDB fields', () => {
      const Movies = model.definitions['sap.capire.movies.Movies']
      const elements = Movies.elements

      expect(elements.ID).to.exist
      expect(elements.ID.key).to.be.true
      expect(elements.ID.type).to.equal('cds.UUID')

      expect(elements.imdbID).to.exist
      expect(elements.imdbID.type).to.equal('cds.String')
      expect(elements.imdbID.length).to.equal(20)

      expect(elements.Title).to.exist
      expect(elements.Title.type).to.equal('cds.String')
      expect(elements.Title.length).to.equal(200)

      expect(elements.Year).to.exist
      expect(elements.Year.type).to.equal('cds.String')
      expect(elements.Year.length).to.equal(4)

      expect(elements.Type).to.exist
      expect(elements.Type.type).to.equal('cds.String')
      expect(elements.Type.length).to.equal(20)

      expect(elements.Poster).to.exist
      expect(elements.Poster.type).to.equal('cds.String')
      expect(elements.Poster.length).to.equal(500)

      expect(elements.Plot).to.exist
      expect(elements.Plot.type).to.equal('cds.String')
      expect(elements.Plot.length).to.equal(1000)

      expect(elements.Director).to.exist
      expect(elements.Director.type).to.equal('cds.String')
      expect(elements.Director.length).to.equal(200)

      expect(elements.Actors).to.exist
      expect(elements.Actors.type).to.equal('cds.String')
      expect(elements.Actors.length).to.equal(500)

      expect(elements.Genre).to.exist
      expect(elements.Genre.type).to.equal('cds.String')
      expect(elements.Genre.length).to.equal(100)

      expect(elements.Runtime).to.exist
      expect(elements.Runtime.type).to.equal('cds.String')
      expect(elements.Runtime.length).to.equal(20)

      expect(elements.Rated).to.exist
      expect(elements.Rated.type).to.equal('cds.String')
      expect(elements.Rated.length).to.equal(10)

      expect(elements.Released).to.exist
      expect(elements.Released.type).to.equal('cds.String')
      expect(elements.Released.length).to.equal(20)

      expect(elements.imdbRating).to.exist
      expect(elements.imdbRating.type).to.equal('cds.String')
      expect(elements.imdbRating.length).to.equal(5)

      expect(elements.searchTerms).to.exist
      expect(elements.searchTerms.type).to.equal('cds.String')
      expect(elements.searchTerms.length).to.equal(1000)
    })
  })

  describe('SearchHistory Entity', () => {
    it('should have SearchHistory entity defined', () => {
      const SearchHistory = model.definitions['sap.capire.movies.SearchHistory']
      expect(SearchHistory).to.exist
      expect(SearchHistory.kind).to.equal('entity')
    })

    it('should have correct structure', () => {
      const SearchHistory = model.definitions['sap.capire.movies.SearchHistory']
      const elements = SearchHistory.elements

      expect(elements.ID).to.exist
      expect(elements.ID.key).to.be.true
      expect(elements.ID.type).to.equal('cds.UUID')

      expect(elements.searchTerm).to.exist
      expect(elements.searchTerm.type).to.equal('cds.String')
      expect(elements.searchTerm.length).to.equal(200)

      expect(elements.resultCount).to.exist
      expect(elements.resultCount.type).to.equal('cds.Integer')

      expect(elements.searchedAt).to.exist
      expect(elements.searchedAt.type).to.equal('cds.Timestamp')

      expect(elements.userSession).to.exist
      expect(elements.userSession.type).to.equal('cds.String')
      expect(elements.userSession.length).to.equal(100)
    })
  })

  describe('Users Entity', () => {
    it('should have Users entity defined', () => {
      const Users = model.definitions['sap.capire.movies.Users']
      expect(Users).to.exist
      expect(Users.kind).to.equal('entity')
    })

    it('should have correct structure', () => {
      const Users = model.definitions['sap.capire.movies.Users']
      const elements = Users.elements

      expect(elements.ID).to.exist
      expect(elements.ID.key).to.be.true
      expect(elements.ID.type).to.equal('cds.UUID')

      expect(elements.username).to.exist
      expect(elements.username.type).to.equal('cds.String')
      expect(elements.username.length).to.equal(50)

      expect(elements.displayName).to.exist
      expect(elements.displayName.type).to.equal('cds.String')
      expect(elements.displayName.length).to.equal(100)

      expect(elements.email).to.exist
      expect(elements.email.type).to.equal('cds.String')
      expect(elements.email.length).to.equal(200)
    })
  })
})
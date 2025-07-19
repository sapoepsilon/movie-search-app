using { sap.capire.movies as movies } from '../db/schema';

@path: '/api'
service MovieService {
  @readonly entity Movies as projection on movies.Movies;
}
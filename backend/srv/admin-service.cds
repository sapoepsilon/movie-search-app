using { sap.capire.movies as movies } from '../db/schema';

@path: '/admin'
@requires: 'ApiKeyUser'
service AdminService {
  entity Movies as projection on movies.Movies {
    *,
    virtual null as _isNew : Boolean
  } excluding { createdAt, createdBy, modifiedAt, modifiedBy };
  
  action importMovies(movies: array of {
    imdbID: String(20);
    Title: String(200);
    Year: String(4);
    Type: String(20);
    Poster: String(500);
    Plot: String(1000);
    Director: String(200);
    Actors: String(500);
    Genre: String(100);
    Runtime: String(20);
    Rated: String(10);
    Released: String(20);
    imdbRating: String(5);
  }) returns array of {
    imdbID: String(20);
    success: Boolean;
    message: String;
  };
}
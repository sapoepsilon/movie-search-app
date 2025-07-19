using { sap.capire.movies as movies } from '../db/schema';

service MovieService {
  @readonly entity Movies as projection on movies.Movies;
  
  action searchMovies(searchTerm: String, page: Integer, type: String) returns {
    Search: array of {
      imdbID: String;
      Title: String;
      Year: String;
      Type: String;
      Poster: String;
    };
    totalResults: String;
    Response: String;
  };
  
  action getMovieById(imdbID: String) returns {
    imdbID: String;
    Title: String;
    Year: String;
    Type: String;
    Poster: String;
    Plot: String;
    Director: String;
    Actors: String;
    Genre: String;
    Runtime: String;
    Rated: String;
    Released: String;
    imdbRating: String;
    Response: String;
    Error: String;
  };
}
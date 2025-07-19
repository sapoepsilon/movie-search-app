namespace sap.capire.movies;

using { managed, cuid } from '@sap/cds/common';

entity Movies : managed {
  key ID        : UUID;
  imdbID        : String(20);
  Title         : String(200);
  Year          : String(4);
  Type          : String(20);
  Poster        : String(500);
  Plot          : String(1000);
  Director      : String(200);
  Actors        : String(500);
  Genre         : String(100);
  Runtime       : String(20);
  Rated         : String(10);
  Released      : String(20);
  imdbRating    : String(5);
  searchTerms   : String(1000);
}

entity SearchHistory : managed {
  key ID          : UUID;
  searchTerm      : String(200);
  resultCount     : Integer;
  searchedAt      : Timestamp;
  userSession     : String(100);
}

entity Users : managed {
  key ID          : UUID;
  username        : String(50);
  displayName     : String(100);
  email           : String(200);
}
import { Movie } from "../entities";

export interface IMoviesRaterInteractor {
  rateMovie: (rate: number) => Movie;
}

export class MoviesRaterInteractor implements IMoviesRaterInteractor {
  public movie: Movie;

  constructor(movie: Movie) {
    this.movie = movie;
  }

  public rateMovie(rate: number) {
    this.movie.setCustomRate(rate);
    return new Movie(this.movie);
  }
}

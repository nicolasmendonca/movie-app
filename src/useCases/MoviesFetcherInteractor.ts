import { Movie } from "../entities";

export interface IMoviesFetcherService {
  fetchMovies: () => Promise<Movie[]>;
}

export class MoviesFetcherInteractor {
  private moviesFetcherService: IMoviesFetcherService;

  constructor(moviesFetcherService: IMoviesFetcherService) {
    this.moviesFetcherService = moviesFetcherService;
  }

  async fetchMovies() {
    return this.moviesFetcherService.fetchMovies();
  }
}

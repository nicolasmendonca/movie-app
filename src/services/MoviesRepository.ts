import axios, { AxiosResponse } from "axios";
import { Movie } from "../entities/Movie";
import { IMoviesFetcherService } from "../useCases";
type FetchType = typeof axios;
import { REACT_NATIVE_TMDB_API_KEY } from "../config";

interface ITmdbMovie {
  id: number;
  title?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  popularity: number;
  original_title?: string;
  original_name?: string;
  name?: string;
}

interface ITmdbMoviePageResponse {
  page: number;
  results: ITmdbMovie[];
  total_pages: number;
  total_results: number;
}

export class TmdbService implements IMoviesFetcherService {
  private fetch: FetchType;

  constructor(fetchClient: FetchType) {
    this.fetch = fetchClient;
  }

  async fetchMovies() {
    return this.fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${REACT_NATIVE_TMDB_API_KEY}`
    ).then((result: AxiosResponse<ITmdbMoviePageResponse>) => {
      return result.data.results.map(
        (movieResponse) =>
          new Movie({
            id: movieResponse.id,
            title: (movieResponse.title ||
              movieResponse.original_title ||
              movieResponse.name ||
              movieResponse.original_name)!,
            overview: movieResponse.overview,
            backdropPath: movieResponse.backdrop_path,
            popularity: movieResponse.popularity,
            posterPath: movieResponse.poster_path,
          })
      );
    });
  }

  public static getMoviePosterPath(movie: Movie) {
    return `https://image.tmdb.org/t/p/w440_and_h660_face${movie.posterPath}`;
  }

  public static getMovieBackdropPath(movie: Movie) {
    return `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${movie.backdropPath}`;
  }
}

export const TmdbFetchService = TmdbService.bind(null, axios);

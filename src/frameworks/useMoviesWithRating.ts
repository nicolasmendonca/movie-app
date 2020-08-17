import React from "react";
import { Movie } from "../entities";
import { MoviesRaterInteractor } from "../useCases";
import { useMovies } from "./useMovies";

export function useMoviesWithRating() {
  const { data, error, isLoading, state } = useMovies();
  const [moviesList, setMoviesList] = React.useState<Movie[] | null>(data);

  function rateMovie(selectedMovie: Movie, customRate: number) {
    const interactor = new MoviesRaterInteractor(selectedMovie);
    const updatedMovie = interactor.rateMovie(customRate);
    setMoviesList((moviesList) =>
      moviesList!.map((movie) =>
        movie.id === selectedMovie.id ? updatedMovie : movie
      )
    );
  }

  React.useEffect(() => {
    if (!isLoading && data) {
      setMoviesList(data);
    }
  }, [isLoading, data]);

  return {
    data: moviesList,
    error,
    isLoading,
    state,
    rateMovie,
  };
}

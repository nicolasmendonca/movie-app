import React from "react";
import { MoviesPageInteractor } from "../useCases";
import { TmdbFetchService } from "../services/MoviesRepository";
import { Movie } from "../entities";
import { useAsyncReducer } from "./useAsyncReducer";

export const MoviesRepository = React.createContext<MoviesPageInteractor>(
  new MoviesPageInteractor(new TmdbFetchService())
);

export function useMovies() {
  const moviesRepository = React.useContext(MoviesRepository);
  const { dispatch, ...asyncReducer } = useAsyncReducer<Movie[]>();

  React.useEffect(() => {
    dispatch({ type: "ASYNC_ACTION_SET_LOADING" });
    moviesRepository
      .fetchMovies()
      .then((movies) => {
        dispatch({ type: "ASYNC_ACTION_SET_SUCCESS", data: movies });
      })
      .catch((e) => {
        dispatch({
          type: "ASYNC_ACTION_SET_ERROR",
          error: e,
        });
      });
  }, []);

  return asyncReducer;
}

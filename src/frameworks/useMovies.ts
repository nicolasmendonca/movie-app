import React from "react";
import { MoviesPageInteractor } from "../useCases";
import { TmdbFetchService } from "../services/MoviesRepository";
import { Movie } from "../entities";
import { useAsyncReducer } from "./useAsyncReducer";

export function useMovies() {
  const moviesRepository = React.useRef(
    new MoviesPageInteractor(new TmdbFetchService())
  ).current;
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

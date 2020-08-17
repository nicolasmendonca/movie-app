import React from "react";
import { MoviesFetcherInteractor } from "../src/useCases";
import { TmdbService } from "../src/services";
import { MoviesRepository } from "../src/frameworks";

export const createMoviePageInteractorInstance = (fetchService: any) =>
  new MoviesFetcherInteractor(new TmdbService(fetchService as any));

export const createWrapper = (
  moviePageInteractorInstance: MoviesFetcherInteractor
): React.FC => ({ children }) => (
  <MoviesRepository.Provider value={moviePageInteractorInstance}>
    {children}
  </MoviesRepository.Provider>
);

export const createWrapperWithFetchService = (fetchService: any) =>
  createWrapper(createMoviePageInteractorInstance(fetchService));

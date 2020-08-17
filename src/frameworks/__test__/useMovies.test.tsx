import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useMovies, MoviesRepository } from "../useMovies";
import { TmdbService, ITmdbMoviePageResponse } from "../../services";
import { MoviesPageInteractor } from "../../useCases";
import { AxiosResponse } from "axios";

const createMoviePageInteractorInstance = (fetchService: any) =>
  new MoviesPageInteractor(new TmdbService(fetchService as any));

const createWrapper = (
  moviePageInteractorInstance: MoviesPageInteractor
): React.FC => ({ children }) => (
  <MoviesRepository.Provider value={moviePageInteractorInstance}>
    {children}
  </MoviesRepository.Provider>
);

const createWrapperWithFetchService = (fetchService: any) =>
  createWrapper(createMoviePageInteractorInstance(fetchService));

describe("useMovies", () => {
  test("request init", () => {
    const fetchService = jest
      .fn()
      .mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapperWithFetchService(fetchService),
    });
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  test("error", async () => {
    const fetchService = jest.fn().mockRejectedValue("something went wrong");
    const { result, waitForValueToChange } = renderHook(() => useMovies(), {
      wrapper: createWrapperWithFetchService(fetchService),
    });

    // initial status is "loading"
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.current.error).toEqual("something went wrong");
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  test("success", async () => {
    const moviesServiceResponse: Partial<AxiosResponse<
      Pick<ITmdbMoviePageResponse, "results">
    >> = {
      data: {
        results: [],
      },
    };
    const fetchService = jest.fn().mockResolvedValue(moviesServiceResponse);
    const { result, waitForValueToChange } = renderHook(() => useMovies(), {
      wrapper: createWrapperWithFetchService(fetchService),
    });

    // initial status is "loading"
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});

import React from "react";
import { render, RenderAPI, waitFor, act } from "@testing-library/react-native";
import { MoviesPage } from "../MoviesPage";
import { MoviesRepository } from "../../frameworks";
import { MoviesPageInteractor } from "../../useCases";
import { TmdbService, ITmdbMoviePageResponse } from "../../services";
import { Movie } from "../../entities";
import { AxiosResponse } from "axios";

test("MoviesPage shows a loading indicator when the request is loading", () => {
  let resolver: (movies: Movie[]) => void;
  let rejecter: (error: any) => void;
  let rendered: RenderAPI;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      })
  );
  rendered = render(
    <MoviesRepository.Provider
      value={new MoviesPageInteractor(new TmdbService(fetchService as any))}
    >
      <MoviesPage />
    </MoviesRepository.Provider>
  );
  expect(rendered.getByText("Loading...")).toBeTruthy();
});

test("when the request fails renders the error message", async () => {
  let reject: (error: any) => void;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((_, rej) => {
        reject = rej;
      })
  );
  const { getByText } = render(
    <MoviesRepository.Provider
      value={new MoviesPageInteractor(new TmdbService(fetchService as any))}
    >
      <MoviesPage />
    </MoviesRepository.Provider>
  );

  act(() => {
    reject("something went wrong");
  });

  const errorMessage = JSON.stringify("something went wrong");
  await waitFor(() => getByText(errorMessage));
  expect(getByText(errorMessage)).toBeTruthy();
});

test("when the request succeeds renders the movie list", async () => {
  let resolve: (movies: Partial<AxiosResponse<ITmdbMoviePageResponse>>) => void;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((res) => {
        resolve = res;
      })
  );
  const { getByText } = render(
    <MoviesRepository.Provider
      value={new MoviesPageInteractor(new TmdbService(fetchService as any))}
    >
      <MoviesPage />
    </MoviesRepository.Provider>
  );

  act(() => {
    resolve({
      data: {
        page: 1,
        results: [
          {
            id: 1,
            original_name: "Movie 1",
            overview: "Overview text",
            popularity: 4.2,
            poster_path: "/poster_path.png",
            backdrop_path: "/backdrop_path.png",
          },
        ],
        total_pages: 10,
        total_results: 100,
      },
    });
  });

  await waitFor(() => getByText("Movie 1"));
  expect(getByText("Movie 1")).toBeTruthy();
});

import React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import { MoviesPage } from "../MoviesPage";
import { MoviesRepository } from "../../frameworks";
import { MoviesFetcherInteractor } from "../../useCases";
import { TmdbService, ITmdbMoviePageResponse } from "../../services";
import { Movie } from "../../entities";
import { AxiosResponse } from "axios";
import { ReactTestInstance } from "react-test-renderer";
import StarRating from "react-native-star-rating";

const renderComponentWithFetchService = (fetchService: any) => (
  <MoviesRepository.Provider
    value={new MoviesFetcherInteractor(new TmdbService(fetchService as any))}
  >
    <MoviesPage />
  </MoviesRepository.Provider>
);

test("MoviesPage shows a loading indicator when the request is loading", () => {
  let resolver: (movies: Movie[]) => void;
  let rejecter: (error: any) => void;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      })
  );
  const { getByText } = render(renderComponentWithFetchService(fetchService));
  expect(getByText("Loading...")).toBeTruthy();
});

test("when the request fails renders the error message", async () => {
  let reject: (error: any) => void;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((_, rej) => {
        reject = rej;
      })
  );
  const { getByText } = render(renderComponentWithFetchService(fetchService));

  act(() => {
    reject("something went wrong");
  });

  const errorMessage = JSON.stringify("something went wrong");
  await waitFor(() => getByText(errorMessage));
  expect(getByText(errorMessage)).toBeTruthy();
});

const successfulMovieResolve: Partial<AxiosResponse<ITmdbMoviePageResponse>> = {
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
        vote_average: 8,
      },
    ],
    total_pages: 10,
    total_results: 100,
  },
};

test("when the request succeeds renders the movie list", async () => {
  let resolve: (movies: Partial<AxiosResponse<ITmdbMoviePageResponse>>) => void;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((res) => {
        resolve = res;
      })
  );
  const { getByText } = render(renderComponentWithFetchService(fetchService));

  act(() => {
    resolve(successfulMovieResolve);
  });

  await waitFor(() => getByText("Movie 1"));
  expect(getByText("Movie 1")).toBeTruthy();
});

test("when the user rates a movie", async () => {
  let movie1StarRatingComponent: ReactTestInstance;
  let resolve: (movies: Partial<AxiosResponse<ITmdbMoviePageResponse>>) => void;
  const fetchService = jest.fn().mockImplementation(
    () =>
      new Promise((res) => {
        resolve = res;
      })
  );

  // since this component does not provide any way to pass down data-testid nor any custom a11y label,
  // we have to use UNSAFE_queryByType.

  const { getByText, UNSAFE_queryByType } = render(
    renderComponentWithFetchService(fetchService)
  );

  act(() => {
    resolve(successfulMovieResolve);
  });

  await waitFor(() => getByText("Movie 1"));

  movie1StarRatingComponent = await UNSAFE_queryByType(StarRating)!;
  expect(movie1StarRatingComponent.props.fullStarColor).toEqual("yellow");
  expect(movie1StarRatingComponent.props.halfStarColor).toEqual("yellow");

  await act(async () => {
    const movie1StarRatingComponent = await UNSAFE_queryByType(StarRating)!;
    movie1StarRatingComponent?.props.selectedStar(5);
  });

  movie1StarRatingComponent = await UNSAFE_queryByType(StarRating)!;

  expect(movie1StarRatingComponent.props.rating).toBe(5);
  expect(movie1StarRatingComponent.props.fullStarColor).toEqual("orange");
  expect(movie1StarRatingComponent.props.halfStarColor).toEqual("orange");
});

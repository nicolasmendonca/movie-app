import { MoviesFetcherInteractor } from "..";
import { IMoviesFetcherService } from "../MoviesFetcherInteractor";

describe("MoviesFetcherInteractor", () => {
  test("fetchMovies success", async () => {
    const movieInstance = {};
    const fetchMovies = jest.fn().mockResolvedValue(movieInstance);
    const moviesFetcherService: IMoviesFetcherService = {
      fetchMovies,
    };
    const instance = new MoviesFetcherInteractor(moviesFetcherService);
    const result = await instance.fetchMovies();
    expect(result).toEqual(movieInstance);
  });

  test("fetchMovies error", async () => {
    const error = new Error("something went wrong");
    const fetchMovies = jest.fn().mockRejectedValue(error);
    const moviesFetcherService: IMoviesFetcherService = {
      fetchMovies,
    };
    const instance = new MoviesFetcherInteractor(moviesFetcherService);
    return instance.fetchMovies().catch((e) => {
      expect(e).toEqual(error);
    });
  });
});

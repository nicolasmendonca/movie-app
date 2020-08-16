import { TmdbService } from "..";
import { MoviesPageInteractor } from "../../useCases";
import { Movie } from "../../entities";

describe("MoviesRepository", () => {
  describe("TmdbService", () => {
    test("fetchMovies method success", async (done) => {
      const movieData: Movie = {
        id: 1,
        backdropPath: "/backdrop.png",
        overview: "overview description",
        popularity: 2.5,
        posterPath: "/poster.png",
        title: "movie name",
      };
      const fetch = jest.fn().mockResolvedValue({
        data: {
          page: 1,
          total_pages: 10,
          total_results: 100,
          results: [
            {
              id: movieData.id,
              backdrop_path: movieData.backdropPath,
              overview: movieData.overview,
              popularity: movieData.popularity,
              poster_path: movieData.posterPath,
              name: movieData.title,
            },
          ],
        },
      });
      const movieService = new TmdbService(fetch as any);
      const instance = new MoviesPageInteractor(movieService);
      const result = await instance.fetchMovies();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.themoviedb.org/3/trending/all/week?api_key="
        )
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(new Movie(movieData));
      done();
    });

    test("fetchMovies method error", () => {
      const error = new Error("something went wrong");
      const fetch = jest.fn().mockRejectedValue(error);
      const movieService = new TmdbService(fetch as any);
      const instance = new MoviesPageInteractor(movieService);
      return instance.fetchMovies().catch((e) => {
        expect(e).toEqual(error);
      });
    });

    test("getMoviePosterPath", () => {
      const posterPath = "/posterpath.png";
      expect(
        TmdbService.getMoviePosterPath({
          posterPath,
        })
      ).toEqual(`https://image.tmdb.org/t/p/w440_and_h660_face${posterPath}`);
    });
    test("getMovieBackdropPath", () => {
      const backdropPath = "/backdroppath.png";
      expect(
        TmdbService.getMovieBackdropPath({
          backdropPath,
        })
      ).toEqual(
        `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${backdropPath}`
      );
    });
  });
});

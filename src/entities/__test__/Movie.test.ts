import { Movie } from "../";

describe("Movie", () => {
  test("constructor", () => {
    const movieData: Movie = {
      id: 1,
      backdropPath: "/backdrop.png",
      overview: "overview",
      popularity: 2.5,
      posterPath: "/poster.png",
      title: "title",
    };
    expect(new Movie(movieData)).toBeInstanceOf(Movie);
  });
});

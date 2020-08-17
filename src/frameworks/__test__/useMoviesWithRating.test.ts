import { renderHook } from "@testing-library/react-hooks";
import { AxiosResponse } from "axios";
import { ITmdbMoviePageResponse } from "../../services";
import { useMoviesWithRating } from "../useMoviesWithRating";
import { act } from "@testing-library/react-native";
import { createWrapperWithFetchService } from "../../../testUtils/useMoviesWrapper";

describe("useMoviesWithRating", () => {
  test("rateMovie", async () => {
    const apiResponse: Partial<AxiosResponse<ITmdbMoviePageResponse>> = {
      data: {
        total_pages: 10,
        total_results: 100,
        page: 1,
        results: [
          {
            id: 1234,
            vote_average: 5.3,
            backdrop_path: "/backdroppath.png",
            overview: "overview text",
            popularity: 100,
            poster_path: "/posterpath.png",
            title: "title",
          },
        ],
      },
    };
    const fetchService = jest.fn().mockResolvedValue(apiResponse);
    const { result, waitForValueToChange } = renderHook(
      () => useMoviesWithRating(),
      {
        wrapper: createWrapperWithFetchService(fetchService),
      }
    );

    await waitForValueToChange(() => result.current.isLoading);
    act(() => {
      result.current.rateMovie(result.current.data![0]!, 5);
    });
    expect(result.current.data![0]!.customRating).toBe(5);
  });
});

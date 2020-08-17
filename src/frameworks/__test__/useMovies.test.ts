import { renderHook } from "@testing-library/react-hooks";
import { AxiosResponse } from "axios";
import { useMovies } from "../useMovies";
import { ITmdbMoviePageResponse } from "../../services";
import { createWrapperWithFetchService } from "../../../testUtils/useMoviesWrapper";

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

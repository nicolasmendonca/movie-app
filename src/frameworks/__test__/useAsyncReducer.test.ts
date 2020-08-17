import { renderHook, act } from "@testing-library/react-hooks";
import { useAsyncReducer } from "../useAsyncReducer";

describe("useAsyncReducer", () => {
  const initialState = {
    data: null,
    status: "idle",
    error: null,
  };

  test("initialState", () => {
    const { result } = renderHook(() => useAsyncReducer<string>());
    expect(result.current.state).toEqual(initialState);
  });

  test("action > set to idle", () => {
    const { result } = renderHook(() => useAsyncReducer<string>());
    act(() => {
      result.current.dispatch({
        type: "ASYNC_ACTION_SET_IDLE",
      });
    });
    expect(result.current.state).toEqual(initialState);
    expect(result.current.isLoading).toBe(false);
  });

  test("action > set loading", () => {
    const { result } = renderHook(() => useAsyncReducer<string>());
    act(() => {
      result.current.dispatch({
        type: "ASYNC_ACTION_SET_LOADING",
      });
    });
    expect(result.current.state).toEqual({
      status: "loading",
      error: null,
      data: null,
    });
    expect(result.current.isLoading).toBe(true);
  });

  test("action > set success", () => {
    const { result } = renderHook(() => useAsyncReducer<string>());
    act(() => {
      result.current.dispatch({
        type: "ASYNC_ACTION_SET_SUCCESS",
        data: "result",
      });
    });
    expect(result.current.state).toEqual({
      status: "success",
      error: null,
      data: "result",
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe("result");
  });

  test("action > set error", () => {
    const { result } = renderHook(() => useAsyncReducer<string>());
    act(() => {
      result.current.dispatch({
        type: "ASYNC_ACTION_SET_ERROR",
        error: "error message",
      });
    });
    expect(result.current.state).toEqual({
      status: "error",
      error: "error message",
      data: null,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("error message");
  });

  test("action > invalid action", () => {
    const { result } = renderHook(() => useAsyncReducer<string>());
    act(() => {
      result.current.dispatch({
        type: "SOMETHING_ELSE",
      } as any);
    });
    expect(result.current.state).toEqual(initialState);
  });
});

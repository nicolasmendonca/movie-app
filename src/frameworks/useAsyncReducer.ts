import React from "react";

type ASYNC_ACTION_SET_IDLE = {
  type: "ASYNC_ACTION_SET_IDLE";
};
type ASYNC_ACTION_SET_LOADING = {
  type: "ASYNC_ACTION_SET_LOADING";
};
type ASYNC_ACTION_SET_SUCCESS<T> = {
  type: "ASYNC_ACTION_SET_SUCCESS";
  data: T;
};
type ASYNC_ACTION_SET_ERROR = {
  type: "ASYNC_ACTION_SET_ERROR";
  error: any;
};

type ASYNC_STATE_IDLE = "idle";
type ASYNC_STATE_LOADING = "loading";
type ASYNC_STATE_SUCCESS = "success";
type ASYNC_STATE_ERROR = "error";

type AsyncStateActionTypes<T> =
  | ASYNC_ACTION_SET_IDLE
  | ASYNC_ACTION_SET_LOADING
  | ASYNC_ACTION_SET_SUCCESS<T>
  | ASYNC_ACTION_SET_ERROR;
type AsyncState =
  | ASYNC_STATE_IDLE
  | ASYNC_STATE_LOADING
  | ASYNC_STATE_SUCCESS
  | ASYNC_STATE_ERROR;

interface AsyncActionState<T> {
  status: AsyncState;
  data: T | null;
  error: any;
}

export function useAsyncReducer<T>() {
  const initialState: AsyncActionState<T> = {
    data: null,
    status: "idle",
    error: null,
  };
  function reducer(
    state: AsyncActionState<T> = initialState,
    action: AsyncStateActionTypes<T>
  ): AsyncActionState<T> {
    switch (action.type) {
      case "ASYNC_ACTION_SET_IDLE":
        return {
          ...initialState,
          status: "idle",
        };
      case "ASYNC_ACTION_SET_LOADING":
        return {
          ...initialState,
          status: "loading",
        };
      case "ASYNC_ACTION_SET_SUCCESS":
        return {
          ...initialState,
          status: "success",
          data: action.data,
        };
      case "ASYNC_ACTION_SET_ERROR":
        return {
          ...initialState,
          status: "error",
          error: action.error,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return {
    state,
    dispatch,
    data: state.data,
    error: state.error,
    isLoading: state.status === "loading",
  };
}

import { START_LOADING, STOP_LOADING } from "./globalConstants";

const startLoading = () => ({
  type: START_LOADING,
});

const stopLoading = () => ({
  type: STOP_LOADING,
});

export { startLoading, stopLoading };

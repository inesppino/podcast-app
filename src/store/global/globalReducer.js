import { START_LOADING, STOP_LOADING } from "./globalConstants";

const INITIAL_STATE = {
  isLoading: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default reducer;

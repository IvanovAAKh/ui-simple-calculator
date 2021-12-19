import {
  ERROR_RECEIVE_MATH_PROBLEMS,
  RECEIVE_MATH_PROBLEMS,
  REQUEST_MATH_PROBLEMS,
} from '../constants/actionTypes';

const initialState = {
  list: [],
  isFailed: false,
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ERROR_RECEIVE_MATH_PROBLEMS: {
      return {
        ...state,
        isFailed: true,
        isFetching: false,
      };
    }

    case RECEIVE_MATH_PROBLEMS: {
      return {
        ...state,
        isFetching: false,
        list: action.payload,
      };
    }

    case REQUEST_MATH_PROBLEMS: {
      return {
        ...state,
        isFetching: true,
        isFailed: false,
      };
    }

    default: return state;
  }
}
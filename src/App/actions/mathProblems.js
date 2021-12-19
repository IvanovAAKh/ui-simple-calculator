import {
  ERROR_RECEIVE_MATH_PROBLEMS,
  RECEIVE_MATH_PROBLEMS,
  REQUEST_MATH_PROBLEMS,
} from '../constants/actionTypes';

const errorReceiveMathProblems = () => ({
  type: ERROR_RECEIVE_MATH_PROBLEMS,
});

const receiveMathProblems = mathProblems => ({
  payload: mathProblems,
  type: RECEIVE_MATH_PROBLEMS,
});

const requestMathProblems = () => ({
  type: REQUEST_MATH_PROBLEMS,
});

const getMathProblems = ({
  problemsCount,
}) => {
  return fetch(
    `http://localhost:8080/math/examples?count=${problemsCount}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).catch(() => ([
    "2 + 2",
    "6 - 7",
    "42 * 42",
    "2 / 0",
    "-1 + -1",
    "-2 - -2",
    "2 = 2",
    "asdf afas f",
  ]));
};

const fetchMathProblems = ({
  problemsCount,
}) => (dispatch) => {
  dispatch(requestMathProblems());
  return getMathProblems({
    problemsCount,
  }).then(problems => dispatch(receiveMathProblems(problems)))
    .catch(() => dispatch(errorReceiveMathProblems()));
};

export default {
  fetchMathProblems,
};
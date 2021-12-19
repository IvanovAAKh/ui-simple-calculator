import React from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import mathProblemsReducer from './reducers/mathProblems';
import App from './containers/App.jsx';

const store = createStore(
  combineReducers({
    mathProblems: mathProblemsReducer,
  }),
  applyMiddleware(thunkMiddleware),
);

export default (props) => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
)
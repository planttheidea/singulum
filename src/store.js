// external dependencies
import isArray from 'lodash/isArray';
import {
  routerReducer
} from 'react-router-redux';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore
} from 'redux';

// modules
import {
  getModules
} from './modules';

const DEFAULT_REDUCERS_WITH_HISTORY = {
  routing: routerReducer
};

const createStore = (modules, {
  history,
  middlewares,
  preloadedState
}) => {
  if (!isArray(modules)) {
    throw new TypeError('The first parameter must be an array of modules.');
  }

  let enhancers = [...middlewares];

  const mapOfReducers = modules.reduce((reducers, {namespace}) => {
    const module = getModules(namespace);

    if (!module) {
      return reducers;
    }

    return {
      ...reducers,
      [namespace]: module.reducer
    };
  }, history ? DEFAULT_REDUCERS_WITH_HISTORY : {});

  const allReducers = combineReducers(mapOfReducers);

  if (enhancers.length) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    enhancers = composeEnhancers(applyMiddleware(...enhancers));
  } else {
    enhancers = undefined;
  }

  return createReduxStore(allReducers, preloadedState, enhancers);
};

export default createStore;

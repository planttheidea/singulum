// external dependencies
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
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

const createStore = (modules, preloadedState, ...middlewares) => {
  if (!isArray(modules)) {
    throw new TypeError('The first parameter must be an array of modules.');
  }

  let enhancers = [...middlewares];

  if (isFunction(preloadedState)) {
    enhancers.unshift(preloadedState);
    preloadedState = {};
  }

  const mapOfReducers = modules.reduce((reducers, {namespace}) => {
    const module = getModules(namespace);

    if (!module) {
      return reducers;
    }

    return {
      ...reducers,
      [namespace]: module.reducer
    };
  }, {});

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

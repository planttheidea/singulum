// external dependencies
import fastMemoize from 'fast-memoize';
import isFunction from 'lodash/isFunction';
import {
  Component
} from 'react';

// constants
import {
  REACT_LIFECYCLE_METHODS,

  keys
} from './constants';

/**
 * get the methods that will be added to the component
 *
 * @param {Object} options
 * @returns {{lifecycleMethods: Object, localMethods: Object}}
 */
const getComponentMethods = (options) => {
  let lifecycleMethods = {},
    localMethods = {};

  keys(options).forEach((method) => {
    if (!!~REACT_LIFECYCLE_METHODS.indexOf(method)) {
      lifecycleMethods[method] = options[method];
    } else if (isFunction(options[method])) {
      localMethods[method] = options[method];
    }
  });

  return {
    lifecycleMethods,
    localMethods
  };
};

/**
 * get the flattened object with both props and methods
 *
 * @param {Object} props
 * @param {Object} methods
 * @returns {Object}
 */
const getPropsAndMethods = (props, methods) => {
  return {
    ...props,
    ...methods
  };
};

/**
 * is the object an extension of the Component prototype
 *
 * @param {*} object
 * @returns {boolean}
 */
const isReactClass = (object) => {
  return Component.isPrototypeOf(object);
};

/**
 * is the object passed an event
 *
 * @param {*} object
 * @returns {boolean}
 */
const isReactEvent = (object) => {
  return !!(object && object.nativeEvent && object.nativeEvent instanceof Event);
};

/**
 * serialize the values for memoization
 *
 * @returns {string}
 */
const memoizeSerializer = function() {
  return JSON.stringify(arguments, (name, value) => {
    if (isFunction(value)) {
      return `${value}`;
    }

    return value;
  });
};

/**
 * use fast-memoize with a custom serializer to handle memoizing functions
 *
 * @param {function} fn
 * @returns {function}
 */
const memoize = (fn) => {
  return fastMemoize(fn, {
    serializer: memoizeSerializer
  });
};

export {getComponentMethods};
export {getPropsAndMethods};
export {isReactClass};
export {isReactEvent};
export {memoize};
export {memoizeSerializer};

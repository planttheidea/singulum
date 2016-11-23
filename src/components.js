// external dependencies
import isFunction from 'lodash/isFunction';
import React, {
  Component as ReactComponent
} from 'react';
import {
  connect
} from 'react-redux';

// constants
import {
  keys
} from './constants';

// utils
import {
  getComponentMethods,
  getPropsAndMethods,
  isReactEvent,
  memoize
} from './utils';

/**
 * create a simple component where props are rendered
 *
 * @param {Object} options
 * @param {Component|function} PassedComponent
 * @returns {Component}
 */
const createComponent = (options, PassedComponent) => {
  if (isFunction(options)) {
    return options;
  }

  const {
    contextTypes,
    mapDispatchToProps,
    mapStateToProps,
    mergeProps,
    propTypes,
    reduxOptions,
    ...restOfOptions
  } = options;

  const {
    lifecycleMethods,
    localMethods
  } = getComponentMethods(restOfOptions);

  PassedComponent.contextTypes = contextTypes;
  PassedComponent.propTypes = propTypes;

  class Component extends ReactComponent {
    constructor(...args) {
      super(...args);

      this.assignLifecycleMethods(lifecycleMethods);
      this.assignLocalMethods(localMethods);
    }

    getPropsToPass = memoize(getPropsAndMethods);
    methods = {};

    /**
     * assign the lifecycle methods to the instance
     *
     * @param {Object} lifecycleMethods
     */
    assignLifecycleMethods = (lifecycleMethods) => {
      keys(lifecycleMethods).forEach((key) => {
        this[key] = (props, state, context) => {
          let args = [this.getPropsToPass(this.props, this.methods)];

          if (props) {
            args.unshift(props);
          }

          args.push(this.context, context);

          return lifecycleMethods[key](...args);
        };
      });
    };

    /**
     * assign the local methods to the instance
     *
     * @param {Object} localMethods
     */
    assignLocalMethods = (localMethods) => {
      keys(localMethods).forEach((key) => {
        this.methods[key] = (...args) => {
          const [
            event,
            ...restOfArgs
          ] = args;

          const isFirstArgEvent = isReactEvent(event);

          let argsToPass = [this.getPropsToPass(this.props, this.methods)];

          if (isFirstArgEvent) {
            argsToPass.unshift(event);
          }

          argsToPass.push(this.context);
          argsToPass.push(isFirstArgEvent ? restOfArgs : args);

          return localMethods[key].apply(undefined, argsToPass);
        };
      });
    };

    render() {
      return (
        <PassedComponent {...this.getPropsToPass(this.props, this.methods)}/>
      );
    }
  }

  if (mapDispatchToProps || mapStateToProps || mergeProps || reduxOptions) {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps, reduxOptions)(Component);
  }

  return Component;
};

export default createComponent;

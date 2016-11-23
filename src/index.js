// external dependencies
import React, {
  PropTypes
} from 'react';
import {
  render as ReactRender
} from 'react-dom';
import {
  Provider
} from 'react-redux';

// components
import createComponent from './components';

// modules
import createModule, {
  getActionConstants
} from './modules';

// store
import createStore from './store';

// ajax
import {
  del,
  get,
  head,
  patch,
  post,
  put,
  setAjaxDefaults
} from './ajax';

window.React = React;

/**
 * render the passed component with the provided store
 *
 * @param {React.Component} Component
 * @param {HTMLElement} element
 * @param {Object} store
 */
const render = (Component, element, store) => {
  ReactRender((
    <Provider store={store}>
      {Component}
    </Provider>
  ), element);
};

export {createComponent};
export {PropTypes};

export {createModule};
export {getActionConstants};

export {createStore};

export {del};
export {get};
export {head};
export {patch};
export {post};
export {put};
export {setAjaxDefaults};

export {render};
export {React as jsx};

export default createComponent;

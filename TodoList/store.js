// external dependencies
import thunk from 'redux-thunk';

import {
  createStore
} from '../src';

import appModule from './modules/app';
import history from './history';

const modules = [
  appModule
];
const middlewares = [
  thunk
];

export default createStore(modules, {
  history,
  middlewares
});

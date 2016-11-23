// external dependencies
import thunk from 'redux-thunk';

import {
  createStore
} from '../src';

import appModule from './modules/app';

const modules = [
  appModule
];

export default createStore(modules, thunk);

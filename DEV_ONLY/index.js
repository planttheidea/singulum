import {
  render
} from '../src';

import App from './App';

// store
import store from './store';

const div = document.createElement('div');

render((
  <App/>
), div, store);

document.body.appendChild(div);

import {
  IndexRoute,
  Router,
  Route,
  render,
  syncHistoryWithStore
} from '../src';

import App from './App';

// store
import store from './store';

// history
import history from './history';

// components
import Home from './pages/Home';

const div = document.createElement('div');

const syncedHistory = syncHistoryWithStore(history, store);

render((
  <Router history={syncedHistory}>
    <Route
      component={App}
      path="/"
    >
      <IndexRoute component={Home}/>
    </Route>
  </Router>
), div, store);

document.body.appendChild(div);

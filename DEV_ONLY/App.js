import createComponent, {
  PropTypes,
  render
} from '../src/index';

import * as actions from './modules/app';

// components
import Button from './components/Button';
import Checkbox from './components/Checkbox';

// store
import store from './store';

const react = {
  propTypes: {
    count: PropTypes.number,
    getStuff: PropTypes.func.isRequired,
    isChecked: PropTypes.bool,
    onClickDecrement: PropTypes.func.isRequired,
    onClickIncrement: PropTypes.func.isRequired,
    onClickSetCheck: PropTypes.func.isRequired
  },

  componentDidMount(props) {
    console.log('mounted with props: ', props);
  },
  componentDidUpdate(previousProps, props) {
    console.log('updated with props: ', props);
  }
};

const redux = {
  mapStateToProps({app}) {
    return app;
  },
  mapDispatchToProps: {
    ...actions
  }
};

const local = {
  onClickDecrement(e, {count, decreaseCounter}) {
    decreaseCounter(count);
  },
  onClickIncrement(e, {count, increaseCounter}) {
    increaseCounter(count);
  },
  onClickSetCheck(e, {isChecked, setIsChecked}) {
    setIsChecked(!isChecked);
  }
};

const options = {
  ...react,
  ...redux,
  ...local
};

const App = createComponent(options, ({
  count,
  isChecked,
  onClickDecrement,
  onClickIncrement,
  onClickSetCheck
}) => {
  return (
    <div>
      <h1>
        App
      </h1>

      <div>
        Current count: {count}
      </div>

      <div>
        <Button onClick={onClickIncrement}>
          Click me to increment the count
        </Button>

        <Button
          disabled={count === 0}
          onClick={onClickDecrement}
        >
          Click me to decrement the count
        </Button>
      </div>

      <div>
        <Checkbox
          isChecked={isChecked}
          label={`${isChecked ? 'Uncheck' : 'Check'} me`}
          onClick={onClickSetCheck}
        />
      </div>
    </div>
  );
});

const div = document.createElement('div');

render((
  <App count={0}/>
), div, store);

document.body.appendChild(div);

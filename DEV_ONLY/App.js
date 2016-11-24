import createComponent, {
  PropTypes
} from '../src/index';

import * as actions from './modules/app';

// components
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import Input from './components/Input';

const react = {
  childContextTypes: {
    foo: PropTypes.string
  },
  propTypes: {
    count: PropTypes.number,
    getStuff: PropTypes.func.isRequired,
    isChecked: PropTypes.bool,
    onClickDecrement: PropTypes.func.isRequired,
    onClickIncrement: PropTypes.func.isRequired,
    onClickSetCheck: PropTypes.func.isRequired
  },

  getChildContext(props) {
    const foo = props.count % 2 === 0 ? 'bar' : 'baz';

    return {
      foo
    };
  },

  componentDidMount(props, context) {
    console.log('mounted with props: ', props);

    props.getStuff();
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

const App = ({count, isChecked, onClickDecrement, onClickIncrement, onClickSetCheck}) => {
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

      <div>
        <h6>
          Count
        </h6>

        <Input/>
      </div>
    </div>
  );
};

export default createComponent(options, App);

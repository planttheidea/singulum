// external dependencies
import isNAN from 'lodash/isNaN';

import createComponent, {
  StatefulComponent,
  PropTypes
} from '../../src';

import * as actions from '../modules/app';

const options = {
  mapStateToProps({app}) {
    return app;
  },

  mapDispatchToProps: {
    ...actions
  }
};

class Input extends StatefulComponent {
  static propTypes = {
    count: PropTypes.number,
    setCount: PropTypes.func.isRequired
  };

  componentDidUpdate({count: previousCount}) {
    const {
      count
    } = this.props;

    if (count !== previousCount) {
      this.refs.input.value = count;
    }
  }

  onChangeInput = (e) => {
    const {
      setCount
    } = this.props;

    const count = parseInt(e.currentTarget.value, 10);

    if (!isNAN(count)) {
      setCount(count);
    }
  };

  render() {
    const {
      count
    } = this.props;

    console.log(this.props);

    return (
      <input
        defaultValue={count}
        onChange={this.onChangeInput}
        ref="input"
        type="number"
      />
    );
  }
}

export default createComponent(options, Input);

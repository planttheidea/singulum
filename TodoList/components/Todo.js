import createComponent, {
  PropTypes
} from '../../src';

import * as actions from '../modules/app';

const options = {
  mapDispatchToProps: {
    ...actions
  }
};

const Todo = ({id, isDone, value}) => {
  return (
    <li data-id={id}>
      {value}
    </li>
  );
};

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired
};

export default createComponent(Todo, options);

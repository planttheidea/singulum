import createComponent, {
  PropTypes
} from '../../src';

// components
import Todo from './Todo';

const TodoList = ({todos}) => {
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            {...todo}
          />
        );
      })}
    </ul>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object)
};

export default createComponent(TodoList);

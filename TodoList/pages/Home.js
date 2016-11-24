import createComponent, {
  PropTypes
} from '../../src';

// components
import TodoList from '../components/TodoList';

const options = {
  mapStateToProps({app}) {
    return app;
  }
};

const Home = ({todos}) => {
  return (
    <section>
      <h1>
        Todo List
      </h1>

      <TodoList todos={todos}/>
    </section>
  );
};

Home.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object)
};

export default createComponent(Home, options);

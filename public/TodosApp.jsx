import React from 'react';
import ReactDOM from 'react-dom';

import todosBranch from './branches/todosBranch';

const todosActions = todosBranch.actions;

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
  }

  state = todosBranch.store;

  componentDidMount() {
    todosBranch.watch(this.onStoreChange);
  }

  shouldComponentUpdate() {
    return !todosBranch.equals(this.state);
  }

  componentWillUnmount() {
    todosBranch.unwatch(this.onStoreChange);
  }

  onClickAddTodo = () => {
    todosActions.addTodo(this.refs.todoValue.value);

    this.refs.todoValue.value = '';
  };

  onClickEditTodo = () => {
    todosActions.editTodo(this.refs.editId.value, this.refs.editValue.value);

    this.refs.editId.value = '';
    this.refs.editValue.value = '';
  };

  onClickRemoveTodo = () => {
    todosActions.removeTodo(this.refs.removeId.value);

    this.refs.removeId.value = '';
  };

  onClickReset = () => {
    todosBranch.reset();

    this.setState(todosBranch.store);
  };

  onClickRestore = () => {
    todosBranch.restore(this.snapshot);

    this.setState(todosBranch.store);
  };

  onClickSnapshot = () => {
    this.snapshot = todosBranch.snapshot();
  };

  onStoreChange = (store) => {
    this.setState(store);
  };

  render() {
    return (
      <div>
        <div>
          <button
            onClick={this.onClickSnapshot}
            ref="snapshot"
            type="button"
          >
            Snapshot
          </button>

          <button
            onClick={this.onClickReset}
            ref="reset"
            type="button"
          >
            Reset
          </button>

          <button
            onClick={this.onClickRestore}
            ref="restore"
            type="button"
          >
            Restore
          </button>
        </div>

        <input
          ref="todoValue"
          type="text"
        />

        <button
          onClick={this.onClickAddTodo}
          ref="addTodo"
          type="button"
        >
          Add todo
        </button>

        <br/>

        <input
          placeholder="ID"
          ref="removeId"
          type="number"
        />

        <button
          onClick={this.onClickRemoveTodo}
          ref="removeTodo"
          type="button"
        >
          Remove todo
        </button>

        <br/>

        <input
          placeholder="ID"
          ref="editId"
          type="number"
        />

        <input
          placeholder="New value"
          ref="editValue"
          type="text"
        />

        <button
          onClick={this.onClickEditTodo}
          ref="editTodo"
          type="button"
        >
          Edit todo
        </button>

        {!!this.state.todos.length && (
          <ul>
            {this.state.todos.map((todo, index) => {
              return (
                <li key={`todo-${index}`}>
                  <div>
                    ID: {todo.id}
                  </div>

                  <div>
                    Value: {todo.value}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

ReactDOM.render(<TodoApp/>, document.querySelector('#app-container'));
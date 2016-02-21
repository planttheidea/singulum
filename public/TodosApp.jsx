import React from 'react';
import ReactDOM from 'react-dom';

import todoBranch from './branches/todoBranch';

const todoActions = todoBranch.actions;

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
    }

    state = todoBranch.store;

    componentDidMount() {
        todoBranch.watch(this.onStoreChange);
    }

    componentWillUnmount() {
        todoBranch.unwatch(this.onStoreChange);
    }

    onClickAddTodo = () => {
        todoActions.addTodo(this.state.todos, this.refs.todoValue.value);

        this.refs.todoValue.value = '';
    };

    onClickEditTodo = () => {
        todoActions.editTodo(this.state.todos, this.refs.editId.value, this.refs.editValue.value);

        this.refs.editId.value = '';
        this.refs.editValue.value = '';
    };

    onClickRemoveTodo = () => {
        todoActions.removeTodo(this.state.todos, this.refs.removeId.value);

        this.refs.removeId.value = '';
    };

    onStoreChange = (store) => {
        this.setState(store);
    };

    render() {
        return (
            <div>
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
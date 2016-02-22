import expect from 'expect';

import singulum from '../src';

const todos = (state = [], action = {}) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: state.length,
                    value: action.value
                }
            ];

        case 'REMOVE_TODO':
            const removeIndex = state.findIndex((item) => {
                return item.id === action.id;
            });

            return [
                ...state.slice(0, removeIndex),
                ...state.slice(removeIndex + 1, state.length)
            ];
        case 'EDIT_TODO':
            const editIndex = state.findIndex((item) => {
                return item.id === action.id;
            });

            return [
                ...state.slice(0, editIndex),
                {
                    ...state[editIndex],
                    value: action.value
                },
                ...state.slice(editIndex + 1, state.length)
            ];

        default:
            return state;
    }
};

const todosSingulum = singulum.branch({
    todos: {
        addTodo(todos = [], value) {
            return [
                ...todos,
                {
                    id: todos.length,
                    value
                }
            ];
        },
        editTodo(todos = [], id, value) {
            const index = todos.findIndex((item) => {
                return item.id === id;
            });

            return [
                ...todos.slice(0, index),
                {
                    ...todos[index],
                    value
                },
                ...todos.slice(index + 1, todos.length)
            ];
        },
        removeTodo(todos = [], id) {
            const index = todos.findIndex((item) => {
                return item.id === id;
            });

            return [
                ...todos.slice(0, index),
                ...todos.slice(index + 1, todos.length)
            ];
        },
        setTodo(todos = [], action) {
            switch (action.type) {
                case 'ADD_TODO':
                    return [
                        ...todos,
                        {
                            id: todos.length,
                            value: action.value
                        }
                    ];

                case 'REMOVE_TODO':
                    const index = todos.find((item) => {
                        return item.id === action.id;
                    });

                    return [
                        ...todos.slice(0, index),
                        ...todos.slice(index + 1, todos.length)
                    ];

                case 'EDIT_TODO':
                    return [
                        ...todos.slice(0, action.id),
                        {
                            id: action.id,
                            value: action.value
                        },
                        ...todos.slice(action.id, todos.length)
                    ];

                default:
                    return todos;
            }
        }
    }
}, {
    todos: []
}, 'todosStore');

const empty = [];
const oneAdded = [
    {
        id: 0,
        value: 'First todo'
    }
];
const threeAdded = [
    {
        id: 0,
        value: 'First todo'
    }, {
        id: 1,
        value: 'Another one'
    }, {
        id: 2,
        value: 'Last time'
    }
];
const twoRemaining = [
    {
        id: 0,
        value: 'First todo'
    }, {
        id: 2,
        value: 'Last time'
    }
];
const finalTodos = [
    {
        id: 0,
        value: 'First todo'
    }, {
        id: 2,
        value: 'Edited value'
    }
];

const emptyTodos = todos();
const emptyTodosStore = todosSingulum.store.todos;

expect(emptyTodos).toEqual(empty);
expect(emptyTodosStore).toEqual(empty);

const firstTodoAdded = todos(emptyTodos, {
    type: 'ADD_TODO',
    value: 'First todo'
});

todosSingulum.actions.setTodo(emptyTodosStore, {
    type: 'ADD_TODO',
    value: 'First todo'
});

expect(firstTodoAdded).toEqual(oneAdded);
expect(todosSingulum.store.todos).toEqual(oneAdded);

let threeTodosAdded = todos(firstTodoAdded, {
    type: 'ADD_TODO',
    value: 'Another one'
});

threeTodosAdded = todos(threeTodosAdded, {
    type: 'ADD_TODO',
    value: 'Last time'
});

todosSingulum.actions.addTodo(todosSingulum.store.todos, 'Another one');
todosSingulum.actions.addTodo(todosSingulum.store.todos, 'Last time');

expect(threeTodosAdded).toEqual(threeAdded);
expect(todosSingulum.store.todos).toEqual(threeAdded);

const twoTodosRemaining = todos(threeTodosAdded, {
    id: 1,
    type: 'REMOVE_TODO'
});

todosSingulum.actions.removeTodo(todosSingulum.store.todos, 1);

expect(twoTodosRemaining).toEqual(twoRemaining);
expect(todosSingulum.store.todos).toEqual(twoRemaining);

const editedTodos = todos(twoTodosRemaining, {
    id: 2,
    type: 'EDIT_TODO',
    value: 'Edited value'
});

todosSingulum.actions.editTodo(todosSingulum.store.todos, 2, 'Edited value');

expect(editedTodos).toEqual(finalTodos);
expect(todosSingulum.store.todos).toEqual(finalTodos);

document.querySelector('#app-container').textContent = 'All simple todo data tests have passed';

import uuid from 'node-uuid';

import {
  createModule
} from '../../src';

const ADD_TODO = 'ADD_TODO';
const DELETE_TODO = 'DELETE_TODO';
const TOGGLE_TODO_DONE = 'TOGGLE_TODO_DONE';

const module = createModule('app');

const addTodo = module.createAction(ADD_TODO);
const deleteTodo = module.createAction(DELETE_TODO);
const toggleTodoDone = module.createAction(TOGGLE_TODO_DONE);

/**
 * add a todo to the list of todos
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
export const addTodoHandler = (state, {payload}) => {
  const todoObject = {
    id: uuid.v4(),
    isDone: false,
    value: payload
  };
  const todos = [
    ...state.todos,
    todoObject``
  ];
  
  return {
    ...state,
    todos
  };
};

/**
 * remove a todo from the list of todos
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
export const deleteTodoHandler = (state, {payload}) => {
  const todoIndex = state.todos.findIndex(({id}) => {
    return id === payload;
  });
  
  const todos = [
    ...state.todos.slice(0, todoIndex),
    ...state.todos.slice(todoIndex + 1)
  ];
  
  return {
    ...state,
    todos
  };
};

/**
 * toggle whether a todo is complete or not
 *
 * @param {Object} state
 * @param {string} payload
 * @returns {{todos: Array<Object>}}
 */
export const toggleTodoDoneHandler = (state, {payload}) => {
  const todoIndex = state.todos.findIndex(({id}) => {
    return id === payload;
  });

  const todos = [
    ...state.todos.slice(0, todoIndex),
    {
      ...state.todos[todoIndex],
      isDone: true
    },
    ...state.todos.slice(todoIndex + 1)
  ];

  return {
    ...state,
    todos
  };
};

const INITIAL_STATE = {
  filter: null,
  todos: []
};

module.createReducer(INITIAL_STATE, {
  [addTodo]: addTodoHandler,
  [deleteTodo]: deleteTodoHandler,
  [toggleTodoDone]: toggleTodoDoneHandler
});

export default module;

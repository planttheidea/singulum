# singulum

`singulum` is a state container and manager for your JavaScript application with a tiny footprint (3.1KB minified and gzipped), attempting to have an explicit and straightforward API while maintaining the best aspects of both [Flux](https://github.com/facebook/flux) and [Redux](https://github.com/reactjs/redux). 

If you are unfamiliar with the Flux principles there are countless articles and blog posts out there, and if you are unfamiliar with Redux then there are some [spectacular videos made by it's founder, Dan Abramov](https://egghead.io/series/getting-started-with-redux). Knowing Flux or Redux is not required for using `singulum`, however having a basic understanding of both provide a good foundation.

#### Getting started

`singulum` acts as a singleton object, which has a small API for building your application's state tree. To install:

```
npm i singulum --save
```

Then to create your first branch:

```
import singulum from 'singulum';

const actions = {
    todos: {
        addTodo(todos = [], value) {
            return [
                ...todos,
                {
                    id: todos.length.
                    value
                }
            ];
        },
        removeTodo(todos = [], id) {
            const todoToRemove = todos.findIndex((todo) => {
                return todo.id === id;
            });
        
            return [
                ...todos.slice(0, todoToRemove),
                ...todos.slice(todoToRemove + 1, todos.length)
            ];
        }
    }
};

const initialValues = {
    todos: []
};

export default singulum.branch(actions, initialValues, 'todosBranch');
```

Actions are automatically-bound to the branch's store, and whatever value is returned from those functions is then applied to the state. You can scope the actions to specific properties on the branch's store as well; in this case, our actions are specific to `todos`, so they are mapped automatically to the `todos` property on our store when the branch is created (no switch statement or merging of full state needed). Now, if you wanted to add a todo:

```
import todosBranch from './todosBranch.js';

const todosActions = todosBranch.actions;

console.log(todosBranch.store); // {todos: []}

todosActions.addTodo('Do a little dance');
todosActions.addTodo('Make a little love');
todosActions.addTodo('Get down tonight');

console.log(todosBranch.store);
/*
    {
        [
            {id: 0, value: 'Do a little dance'},
            {id: 1, value: 'Make a little love'},
            {id: 2, value: 'Get down tonight'}
        ]
    }
*/

todosActions.removeTodo(1);

console.log(todosBranch.store);
/*
    {
        [
            {id: 0, value: 'Do a little dance'},
            {id: 2, value: 'Get down tonight'}
        ]
    }
*/
```

Boom, you're on your way. 

This is a rudimentary example obviously, but there is much more to see over in the [API](API.md) section, including how to use reducers for your entire store, as well as how to easily bind it to the component lifecycle if you are using React.

#### Why create singulum?

Flux was a giant leap in the right direction for managing the data flow within applications. That said, the clear separation of actions and stores (and then manuall binding actions to their store property) creates a lot of boilerplate code. Also, the concept of a single dispatcher has good intentions, but is largely unnecessary with appropriate data flow. 

Redux helped with both of these concepts, as it removed Flux dispatchers in favor of pure functions, which also allowed for a greater focus on immutability. Consequently, the wall between declaring actions and stores came down, as your store is governed by many functions (reducers) which operates as the action itself, and you can combine the reducers to create a single store.

*That's great, so what's different about singulum?*

`singulum` attempts to blend the two concepts into a more digestable solution. While Flux's separate declaration of actions and stores that need to be later bound creates boilerplate, the logical separation of actions and stores makes sense as a cause-effect relationship. While Redux set the stage for a more pure state manager, it can be difficult to understand the hierarchy of data in your state tree due to the "build many pebbles and combine them into a foundation" nature of combineReducers. Plus (subjectively) `switch` statements don't feel like an extensible paradigm.

`singulum` allows for simple, unified declaration of actions and stores, but creates a logical separation of them when in use, and doesn't require any boilerplate binding code. Additionally, `singulum` allows for great control over granularity of your actions (either for the entire store or a specific property), with the declarative relationship being very explicit.

#### Browser support

There are no external dependencies of `singulum`, so all modern browsers are supported. If you want to support IE9-11 then the [es6-promise polyfill](https://github.com/stefanpenner/es6-promise) (or equivalent) will need to be provided, as Promises are not supported natively in IE. Due to the lack of ES5 support for certain features (namely `Object.definePropety`), IE8 and below are not supported.
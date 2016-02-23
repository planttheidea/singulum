# singulum

`singulum` is a state container and manager for your JavaScript application with a tiny footprint (2.1KB minified and gzipped), attempting to have an explicit and straightforward API while maintaining the best aspects of both [Flux](https://github.com/facebook/flux) and [Redux](https://github.com/reactjs/redux). If you are unfamiliar with the Flux principles there are countless tutorials out there, and if you are unfamiliar with Redux then there are some spectacular videos made by it's founder.

#### Why create Singulum?

While Flux was a giant leap in the right direction for managing the data flow within applications, there are a couple things about it that are either troublesome, or add unnecessary processing. The wall between declaration of actions and stores (and then inevitably re-binding them to each other) creates a lot of boilerplate code. Also, the concept of a single dispatcher has good intentions, but has many side-effects from an implementation perspective. Redux helped with both of these concepts, as it removed dispatchers (at least the flux version of them) in favor of pure functions, which allowed for a greater focus on immutability. Consequently, the wall between declaring actions and stores came down, as your store is governed by a function (reducer) which operates as the action itself. Beautiful.

*That's great, so what's different about Singulum?*

Singulum attempts to blend the two concepts into a more digestable solution. While Flux's declaration of actions and stores as separate entities that need to be re-bound to one another creates boilerplate, the logical separation of actions and stores makes sense as a cause-effect relationship. While Redux set the stage for a more pure state manager, there is a different version of boilerplate (namely switch statements and consolidated actions) that is a side-effect of trying to follow the Elm architecture. Not only that, the state doesn't feel like an actual tree ... while it is all consolidated into a single object, the API used to build it combines a series of reducers, which is more like using many stones to build a foundation (outward-in) than branching from a tree (inward-out). Singulum allows for simplified declaration of actions and stores without boilerplate, but creates a logical separation of them when in use. Additionally, Singulum allows for great control over granularity of your reducers (either the entire store or a specific property), with the declarative relationship being very explicit.

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

Actions are auto-bound to the store of the branch with which they are created, and whatever value is returned from those functions is then applied to the state. You can scope the actions to specific properties on the branch's store as well; in this case, our actions are specific to `todos`, so they are mapped automatically to the `todos` property on our store when the branch is created (no switch statement or merging of full state needed). Now, if you wanted to add a todo:

```
import todosBranch from './todosBranch.js';

const todosActions = todosBranch.actions;

const startingStore = todosBranch.store; // {todos: []}

todosActions.addTodo(todosBranch.store.todos, 'Learn Flux');
todosActions.addTodo(todosBranch.store.todos, 'Learn Redux');
todosActions.addTodo(todosBranch.store.todos, 'Apply Singulum');

console.log(todosBranch.store);
/*
    {
        [
            {id: 0, value: 'Learn Flux'},
            {id: 1, value: 'Learn Redux'},
            {id: 2, value: 'Apply Singulum'}
        ]
    }
*/

todosActions.removeTodo(todosBranch.store.todos, 1);

console.log(todosBranch.store);
/*
    {
        [
            {id: 0, value: 'Learn Flux'},
            {id: 2, value: 'Apply Singulum'}
        ]
    }
*/
```

Boom, you're on your way. 

This is a rudimentary example obviously, but there is much more to see over in the [API](API.md) section, including how to use more traditional reducers that are not scoped or how to easily bind it to the component lifecycle if you are using React.

#### Browser support

There are no external dependencies of Singulum, however if you want to support IE9-11 then the ES2015 Promises polyfill will need to be provided, as it is not supported natively. Due to the lack of ES5 support for certain features (namely `Object.definePropety`), IE8 and below are not supported.
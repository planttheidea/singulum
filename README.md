# singulum

`singulum` is a state container and manager for your JavaScript application with a tiny footprint (2.2KB minified and gzipped), attempting to have an explicit and straightforward API while maintaining the best aspects of both [Flux](https://github.com/facebook/flux) and [Redux](https://github.com/reactjs/redux). If you are unfamiliar with the Flux principles there are countless tutorials out there, and if you are unfamiliar with Redux then there are some [spectacular videos made by it's founder, Dan Abramov](https://egghead.io/series/getting-started-with-redux). Knowing is not required for using `singulum`, however having a basic understanding of both provide a good foundation.

#### Why create singulum?

While Flux was a giant leap in the right direction for managing the data flow within applications, there are a couple things about it that are either troublesome, or add unnecessary processing. The wall between declaration of actions and stores (and then inevitably re-binding them to each other) creates a lot of boilerplate code. Also, the concept of a single dispatcher has good intentions, but has many side-effects from an implementation perspective. Redux helped with both of these concepts, as it removed dispatchers (at least the flux version of them) in favor of pure functions, which allowed for a greater focus on immutability. Consequently, the wall between declaring actions and stores came down, as your store is governed by a function (reducer) which operates as the action itself. Beautiful.

*That's great, so what's different about singulum?*

`singulum` attempts to blend the two concepts into a more digestable solution. While Flux's declaration of actions and stores as separate entities that need to be re-bound to one another creates boilerplate, the logical separation of actions and stores makes sense as a cause-effect relationship. While Redux set the stage for a more pure state manager, there is a different version of boilerplate (namely switch statements and consolidated actions) that is a side-effect of trying to follow the Elm architecture. Not only that, the state doesn't feel like an actual tree ... while it is all consolidated into a single object, the API used to build it combines a series of reducers, which is more like using many stones to build a foundation (outward-in) than branching from a tree (inward-out). `singulum` allows for simplified declaration of actions and stores without boilerplate, but creates a logical separation of them when in use. Additionally, `singulum` allows for great control over granularity of your reducers (either the entire store or a specific property), with the declarative relationship being very explicit.

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

#### Browser support

There are no external dependencies of `singulum`, so all modern browsers are supported. If you want to support IE9-11 then the [es6-promise polyfill](https://github.com/stefanpenner/es6-promise) (or equivalent) will need to be provided, as Promises are not supported natively in IE. Due to the lack of ES5 support for certain features (namely `Object.definePropety`), IE8 and below are not supported.
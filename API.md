# singulum API

The API for Singulum is intentionally limited, leaving a great deal of flexibility while abstracting a lot of the tedious boilerplate code.

#### .branch(actions[, initialValues, displayName])
*@param {Object} actions*

*@param {Object} initialValues (optional, defaults to {})*

*@param {string} displayName (optional, defaults to numeric counter)*

*@returns {Singulum}*

```
import singulum from 'singulum';

const actions = {
    setCounter(counter = 0, action) {
        if (action === 'add') {
            return counter + 1;
        }
        
        if (action === 'subtract') {
            return counter - 1;
        }
        
        return counter;
    }
};

const initialValues = {
    counter: 0
};

export default singulum.branch(actions, initialValues, 'counterBranch');
```

The crux of the functionality, as it creates the store (based on `initialValues`) and the actions (`actions`) that are bound either to the store as a whole or to a specific store property. `displayName` is an optional value that will provide a name to the store for easy identification. It returns a `Singulum` object that is a child on the tree from the root singulum object (which itself a `Singulum`). One thing to note is that the first parameter passed to any action is an injected value based on how the action maps to your store. This means if you map an action to a specific property on the store, that property is injected, else the entire store is injected. With the above action, you could simply call `branch.actions.setCounter('add')`, no need to pass the existing store object.

The cool thing is, because every branch is a `Singulum` itself, you can branch as deeply as you would like. This allows you to build a state tree that represents the data hierarchy of your application very easily.

#### .store
*@returns {SingulumStore}*

```
import exampleBranch from 'branches/exampleBranch';

class ExampleApp extends React.Component {
    ...
    state = exampleBranch.store;
    ...
}
```

A simple getter, returning a shallowly cloned and frozen `SingulumActions` object of the branch's store.

#### .actions
*@returns {SingulumActions}*

```
import exampleBranch from 'branches/exampleBranch';

const exampleActions = exampleBranch.actions;

class ExampleApp extends React.Component {
    ...
}
```

A simple getter, returning a shallowly cloned and frozen `SingulumStore` object of all actions in the branch.

#### .pluck([key])
*@param {string|Array} key (optional, defaults to undefined)*

*@returns {any}*

```
const todos = appBranch.pluck('todos');
const user = appBranch.pluck(['userName', 'userId']);
```

Retrieves a specific key in the store. Due to the cloned and frozen nature of the store, `branch.pluck('example')` is much more efficient than `branch.store.example`. If an array is passed, then an array of values is returned.

#### .reset()
*@returns {Singulum}*

```
componentWillUnmount() {
    homeBranch.reset();
}
```

Resets the store for the branch to the values originally provided in its creation.

#### .snapshot([snapshotBranches])
*@param {boolean} snapshotBranches (optional, defaults to false)*

*@returns {SingulumSnapshot}*

```
onCreateSnapshot() {
   this.currentSnapshot = appBranch.snapshot(true); 
}
```

Creates and returns a snapshot of the current store's values. If true is passed to the method, a snapshot is taken of all child branches as well.

#### .restore(snapshot[, resetBranches])
*@param {SingulumSnapshot} snapshot*

*@param {boolean} resetBranches (optional, defaults to false)*

*@returns {Singulum}*

```
componentDidMount() {
    clientSideApp.restore(serverSideSnapshot, true);
}
```

Restores the branch's store to its state when the snapshot was taken (see .snapshot()). If the second parameter is true, and the snapshot includes snapshots of child stores, it restores all child stores to their original state as well.

#### .watch(callback)
*@param {Function} callback*

*@returns {Singulum}*

```
componentDidMount() {
    appBranch.watch(this.onStoreChange);
}

onStoreChange = (store) => {
    this.setState(store);
};
```

Adds listener callback to be fired upon an update to that branch's store.

#### .unwatch()
*@returns {Singulum}*

```
componentWillUnmount() {
    appBranch.unwatch(this.onStoreChange);
}
```

Removes listener callback associated with branch for store updates.
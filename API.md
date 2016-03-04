# singulum API

The API for `singulum` is intentionally limited, leaving a great deal of flexibility while abstracting a lot of the tedious boilerplate code.

#### .branch(actions[, initialValues = {}, displayName = 0])
*@param {Object} actions*

*@param {Object} initialValues (optional)*

*@param {string} displayName (optional)*

*@returns {Singulum}*

```
import singulum from 'singulum';

const actions = {
    counter: {
        setCounter(counter = 0, action) {
            if (action === 'add') {
                return counter + 1;
            }
            
            if (action === 'subtract') {
                return counter - 1;
            }
            
            return counter;
        }
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

Returns an immutable and shallowly-frozen `SingulumStore` object of the branch's store. 

All items (including sub-keys or sub-indexes on nested objects) within the store will be getters-only to prevent state from being set outside of your actions. This is obviously to your benefit, however it adds some noise to the object in the console if you want to see it in the console. As such, a convenience method has been added to see the object in it's normal form:
 
```
exampleBranch.store.log();
```

#### .actions
*@returns {SingulumActions}*

```
import exampleBranch from 'branches/exampleBranch';

const exampleActions = exampleBranch.actions;

class ExampleApp extends React.Component {
    ...
}
```

Returns an immutable and shallowly-frozen `SingulumActions` object of the branch's actions.

Just like `.store`, `.actions` has a logger built-in:

```
exampleBranch.actions.log();
```

#### .equals(object[, key])
*@param {any} object*

*@param {string} key (optional)*

*@returns {boolean}*

```
shouldComponentUpdate(nextProps, nextState) {
    return !exampleBranch.equals(nextState);
}
```

Performs deep value equality check of *object* to store based on hashCode. If key is passed, equality comparison is performed on that key in the store rather than the entire store.

#### .hashCode([key])
*@param {string} key (optional)*

*@returns {number}*

```
import exampleBranch from 'branches/exampleBranch';

const initialHashCode = exampleBranch.hashCode();

class ExampleApp extends React.Component {
    ...
    componentDidUpdate() {
        if (exampleBranch.hashCode() === initialHashCode) {
            console.log('returned to original state');
        }
    }
}
```

Exposes hashCode of store used in equality checks. If key is passed, provides hashCode for that key in the store only.

#### .reset()
*@returns {Singulum}*

```
componentWillUnmount() {
    exampleBranch.reset();
}
```

Resets the store for the branch to the values originally provided in its creation.

#### .snapshot([snapshotBranches = false])
*@param {boolean} snapshotBranches (optional)*

*@returns {SingulumSnapshot}*

```
onCreateSnapshot() {
   this.currentSnapshot = exampleBranch.snapshot(true); 
}
```

Creates and returns a snapshot of the current store's values. If true is passed to the method, a snapshot is taken of all child branches as well.

#### .restore(snapshot[, resetBranches = false])
*@param {SingulumSnapshot} snapshot*

*@param {boolean} resetBranches (optional)*

*@returns {Singulum}*

```
componentDidMount() {
    exampleBranch.restore(serverSideSnapshot, true);
}
```

Restores the branch's store to its state when the snapshot was taken (see .snapshot()). If the second parameter is true, and the snapshot includes snapshots of child stores, it restores all child stores to their original state as well.

#### .watch(callback)
*@param {Function} callback*

*@returns {Singulum}*

```
componentDidMount() {
    exampleBranch.watch(this.onStoreChange);
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
    exampleBranch.unwatch(this.onStoreChange);
}
```

Removes listener callback associated with branch for store updates.
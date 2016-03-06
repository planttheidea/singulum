import {
  bindFunction,
  findIndex,
  forEachObject,
  getClone,
  getMutableObject,
  hashCode,
  isClassInstance,
  isEqual,
  isFunction,
  isInstanceOf,
  isObject,
  isProduction,
  isString,
  isUndefined,
  setHidden,
  setImmutable,
  setReadonly,
  throwError
} from './utils';

const OBJECT_FREEZE = Object.freeze;
const isEnvProduction = isProduction();

/**
 * This is a basic counter in case a namespace is not provided when creating
 * a branch
 */
let namespaceIncrementer = 0;

/**
 * Creates namespaced Singulum within the object, aka make a branch
 *
 * @param {Singulum} singulum
 * @param {string} namespace
 * @param {Object} actions
 * @param {Object} initialValues
 * @returns {Object}
 */
const createNewSingulumNamespace = (singulum, namespace, actions = {}, initialValues = {}) => {
  /**
   * if no namespace is provided, use the simple counter to create a unique entry
   */
  if (!namespace) {
    namespace = namespaceIncrementer;
    namespaceIncrementer++;
  }

  setReadonly(singulum, namespace, new Singulum(actions, initialValues));

  singulum.$$store[namespace] = singulum[namespace];
  singulum.store = new SingulumStore(singulum.$$store);

  return singulum[namespace];
};

/**
 * Creates new item in the store, and creates related action with wrapper
 *
 * @param {Singulum} singulum
 * @param {Object} actions
 * @param {Object} initialValues
 */
const createNewSingulumLeaves = (singulum, actions = {}, initialValues = {}) => {
  forEachObject(initialValues, (initialValue, storeKey) => {
    /**
     * Create separate clones for initialValues and store, so that references between
     * the two do not exist
     */
    singulum.$$initialValues[storeKey] = initialValue;
    singulum.$$store[storeKey] = getFreshValueClone(initialValue);
  });

  forEachObject(actions, (action, actionKey) => {
    /**
     * if action is a function, then it applies to the entire state
     */
    if (isFunction(action)) {
      singulum.$$actions[actionKey] = createWrapperFunction(singulum, action);
    } else if (isObject(action)) {
      /**
       * if action is a map of functions, it applies to a specific key on the store
       */
      forEachObject(action, (actionFn, actionFnKey) => {
        singulum.$$actions[actionFnKey] = createWrapperFunction(singulum, actionFn, actionKey);
      });
    }
  });
};

/**
 * Creates bound and wrapped function to store new value internally and invoke listener
 * If function is asyncronous, it waits for the promise to be resolved before firing
 *
 * @param {Singulum} singulum
 * @param {Function} fn
 * @param {string} key
 * @return {Function}
 */
const createWrapperFunction = (singulum, fn, key) => {
  /**
   * @note must be a standard function instead of an arrow function, to allow the this binding
   */
  return bindFunction(function (...args) {
    const primaryArgument = key ? singulum.$$store[key] : singulum.$$store;
    const result = fn(primaryArgument, ...args);

    /**
     * If the result is a Promise, wait for resolution and then return the data
     */
    if (isFunction(result.then)) {
      return result.then((resultValue) => {
        return updateStoreValue(this, resultValue, key);
      });
    }

    /**
     * Otherwise, wrap the return data in a native Promise and return it
     */
    return Promise.resolve(updateStoreValue(this, result, key));
  }, singulum);
};

/**
 *
 * @param {Singulum} singulum
 */
const fireWatchers = (singulum) => {
  singulum.$$watchers.forEach((watcher) => {
    watcher(singulum.store);
  });
};

/**
 * If the value is a class, return a cloned version of that class including prototype,
 * else return value clone of object
 *
 * @param {*} value
 * @returns {*}
 */
const getFreshValueClone = (value) => {
  const isValueInstance = isClassInstance(value);

  if (isValueInstance) {
    return Object.create(
      Object.getPrototypeOf(value),
      Object.getOwnPropertyNames(value).reduce((previous, current) => {
        previous[current] = Object.getOwnPropertyDescriptor(value, current);

        return previous;
      }, {})
    );
  }

  return getClone(value, SingulumStore);
};

/**
 * Assigns new result to store, fires listener with new SingulumStore, and returns
 * Promise with new result
 *
 * @param {Singulum} singulum
 * @param {string} key
 * @param {*} result
 * @returns {Promise}
 */
const updateStoreValue = (singulum, result, key) => {
  /**
   * Apply new result value to the store, scoped if the key is provided
   */
  if (key) {
    singulum.$$store[key] = result;
  } else {
    singulum.$$store = result;
  }

  singulum.store = new SingulumStore(singulum.$$store);

  /**
   * If there is a watcher, fire it
   */
  fireWatchers(singulum);

  return result;
};

/**
 * Actions class provided with [branchName].actions
 */
class SingulumActions {
  /**
   * Create immutable and frozen object of internal actions
   *
   * @param {Object} actions
   * @returns {Object}
   */
  constructor(actions = {}) {
    let returnValue = isEnvProduction ? {} : this;

    forEachObject(actions, (value, key) => {
      setImmutable(returnValue, key, actions[key]);
    });

    if (!isEnvProduction) {
      OBJECT_FREEZE(returnValue);
    }

    return returnValue;
  }

  log() {
    if (console) {
      console.log(getMutableObject(this));
    }
  }
}

/**
 * Store class provided with [branchName].store
 */
class SingulumStore {
  /**
   * Create immutable and frozen object of store
   * branched from it
   *
   * @param {Object} store
   * @returns {Object}
   */
  constructor(store = {}) {
    let returnValue = isEnvProduction ? {} : this;

    forEachObject(store, (value, key) => {
      setImmutable(returnValue, key, isInstanceOf(value, Singulum) ? value.store : value);
    });

    if (!isEnvProduction) {
      OBJECT_FREEZE(returnValue);
    }

    return returnValue;
  }

  log() {
    if (console) {
      console.log(getMutableObject(this));
    }
  }
}

/**
 * Snapshot class provided with [branchName].snapshot();
 */
class SingulumSnapshot {
  /**
   * Create snapshot clone of store, optionally snapshotting deeply
   *
   * @param {SingulumStore} store
   * @param {Singulum} $$store
   * @param {boolean} snapshotBranches
   * @returns {Object}
   */
  constructor(store = {}, $$store = {}, snapshotBranches) {
    forEachObject(store, (value, key) => {
      const $$value = $$store[key];

      if (isInstanceOf($$value, Singulum)) {
        this[key] = snapshotBranches ? new SingulumSnapshot($$value.store, $$value.$$store, snapshotBranches) : $$value;
      } else {
        this[key] = getClone($$value, SingulumStore);
      }
    });

    return this;
  }
}

/**
 * Main class
 */
class Singulum {
  /**
   * Create singulum infrastructure, and populate leaves provided
   *
   * @param {Object} actions
   * @param {Object} initialValues
   * @returns {Singulum}
   */
  constructor(actions = {}, initialValues = {}) {
    setHidden(this, '$$actions', []);
    setHidden(this, '$$initialValues', {});
    setHidden(this, '$$watchers', []);
    setHidden(this, '$$snapshots', {});
    setHidden(this, '$$store', {});

    createNewSingulumLeaves(this, actions, initialValues);

    this.actions = isEnvProduction ? this.$$actions : new SingulumActions(this.$$actions);
    this.store = new SingulumStore(this.$$store);

    return this;
  }

  /**
   * Create namespaced Singulum child
   *
   * @param {Object} actions
   * @param {Object} initialValues
   * @param {string} namespace
   * @returns {Singulum}
   */
  branch(actions = {}, initialValues = {}, namespace) {
    /**
     * if a namespace is provided but it isn't a string value, make it one
     */
    if (namespace && !isString(namespace)) {
      namespace = namespace.toString();
    }

    return createNewSingulumNamespace(this, namespace, actions, initialValues);
  }

  /**
   * Determine if object passed is equal in value to the branch
   * If key is passed, performs value equality check on branch[key] only
   *
   * @param {*} object
   * @param {string} key
   * @returns {*}
   */
  equals(object, key) {
    if (key) {
      return isEqual(this.$$store[key], object, Singulum);
    }

    return isEqual(this.$$store, object, Singulum);
  }

  hashCode(key) {
    if (key) {
      return hashCode(this.$$store[key], Singulum);
    }

    return hashCode(this.$$store, Singulum);
  }

  /**
   * Return singulum to its original state
   *
   * @param {boolean} resetBranches
   * @returns {Singulum}
   */
  reset(resetBranches = false) {
    let newStore = {};

    forEachObject(this.$$store, (value, key) => {
      if (isInstanceOf(value, Singulum)) {
        /**
         * if snapshot value is a Singulum and you want to reset child branches, then trigger
         * .reset() on child branch, else retain existing value
         */
        newStore[key] = resetBranches ? value.reset() : value;
      } else if (!isUndefined(this.$$initialValues[key])) {
        /**
         * If the value is a non-Singulum value and it existed in initialValues, assign its
         * initialValue to the store
         */
        newStore[key] = this.$$initialValues[key];
      }
    });

    this.$$store = newStore;
    this.store = new SingulumStore(this.$$store);

    /**
     * If there is a watcher, fire it
     */
    fireWatchers(this);

    return this;
  }

  /**
   * Restore values in store based on snapshot, optionally restored deeply
   *
   * @param {SingulumSnapshot} snapshot
   * @param {boolean} restoreBranches
   * @returns {Singulum}
   */
  restore(snapshot, restoreBranches = false) {
    /**
     * Make sure snapshot passed is a SingulumSnapshot
     */
    if (!isInstanceOf(snapshot, SingulumSnapshot)) {
      throwError('Snapshot used in restore method must be a SingulumSnapshot.');
    }

    forEachObject(snapshot, (value, key) => {
      if (!isInstanceOf(value, Singulum)) {
        if (isInstanceOf(value, SingulumSnapshot)) {
          /**
           * if the snapshot value is a SingulumSnapshot and you want to reset
           * child branches, then trigger restore on the child branch passing value
           * as branch's snapshot
           */
          this.$$store[key] = restoreBranches ? this.$$store[key].restore(value, restoreBranches) : value;
        } else if (!isInstanceOf(value, SingulumStore)) {
          /**
           * If the snapshot value is not a Singulum, re-apply it to the store
           */
          this.$$store[key] = isInstanceOf(value, Singulum) ? value.store : value;
        }
      }
    });

    this.store = new SingulumStore(this.$$store);

    /**
     * If there is a watcher, fire it
     */
    fireWatchers(this);

    return this;
  }

  /**
   * Create snapshot of current store state, optionally snapshot deeply
   *
   * @param {boolean} snapshotBranches
   * @returns {SingulumSnapshot}
   */
  snapshot(snapshotBranches = false) {
    return new SingulumSnapshot(this.store, this.$$store, snapshotBranches);
  }

  /**
   * Clear out callback bound to $$watchers
   *
   * @returns {Singulum}
   */
  unwatch(callback) {
    const watcherIndex = findIndex(this.$$watchers, (watcher) => {
      return watcher === callback;
    });

    this.$$watchers = [
      ...this.$$watchers.slice(0, watcherIndex),
      ...this.$$watchers.slice(watcherIndex + 1, this.$$watchers.length)
    ];

    return this;
  }

  /**
   * Add callback to $$watchers, to be fired whenever store updates
   *
   * @param {Function} callback
   * @returns {Singulum}
   */
  watch(callback) {
    /**
     * Make sure callback is actually a function before setting it
     */
    if (isFunction(callback)) {
      this.$$watchers = [
        ...this.$$watchers,
        callback
      ];
    }

    return this;
  }
}

export {SingulumActions as SingulumActions};
export {SingulumSnapshot as SingulumSnapshot};
export {SingulumStore as SingulumStore};

export default Singulum;
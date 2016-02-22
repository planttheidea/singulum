import {
    bindFunction,
    forEachObject,
    getClone,
    isArray,
    isFunction,
    isInstanceOf,
    isObject,
    isString,
    setHidden,
    setReadonly,
    throwError
} from './utils';

const OBJECT_ASSIGN = Object.assign;

/**
 * Assigns new result to store, fires listener with new SingulumStore, and returns
 * Promise with new result
 *
 * @param {Object} object
 * @param {string} key
 * @param {*} result
 * @returns {Promise}
 */
const updateStoreValue = (object, result, key) => {
    if (key) {
        object.$$store[key] = result;
    } else {
        object.$$store = {
            ...object.$$store,
            ...result
        };
    }

    if (isFunction(object.$$listener)) {
        object.$$listener(object.store);
    }

    return result;
};

/**
 * Creates bound and wrapped function to store new value internally and invoke listener
 * If function is asyncronous, it waits for the promise to be resolved before firing
 *
 * @param {Function} fn
 * @param {string} key
 * @return {Function}
 */
const createWrapperFunction = function(thisArg, fn, key) {
    return bindFunction(function(...args) {
        const result = fn(...args);

        if (result.then) {
            return result.then((resultValue) => {
                return updateStoreValue(this, resultValue, key);
            });
        }

        return Promise.resolve(updateStoreValue(this, result, key));
    }, thisArg);
};

/**
 * Creates namespaced Singulum within the object, aka make a branch
 *
 * @param {Object} object
 * @param {string} namespace
 * @param {Object} leaves
 * @returns {Object}
 */
const createNewSingulumNamespace = (object, namespace, leaves) => {
    setReadonly(object, namespace, new Singulum(leaves));

    object.$$store[namespace] = object[namespace];

    return object[namespace];
};

/**
 * Creates new item in the store, and creates related action with wrapper
 *
 * @param {Object} branch
 * @param {string} key
 * @param {Object} map
 */
const createNewSingulumLeaf = (branch, map, key) => {
    if (!isObject(map) && !isFunction(map)) {
        throwError('Must provide a map of leaves to branch.');
    }

    /**
     * @note create unique clones for each so that deeply nested object references don't exist
    */
    if (isObject(map)) {
        branch.$$initialValues[key] = getClone(map.initialValue, SingulumStore);
        branch.$$store[key] = getClone(map.initialValue, SingulumStore);

        forEachObject(map, (actionFn, action) => {
            if (action !== 'initialValue' && isFunction(actionFn)) {
                branch.$$actions[action] = createWrapperFunction(branch, actionFn, key);
            }
        });
    } else {
        branch.$$actions[key] = createWrapperFunction(branch, map);
    }
};

/**
 * Actions class provided with [branchName].actions
 */
class SingulumActions {
    /**
     * Create shallow clone of internal actions, and freeze
     *
     * @param {Object} actions
     * @returns {Object}
     */
    constructor(actions) {
        OBJECT_ASSIGN(this, actions);

        return this;
    }
}

/**
 * Store class provided with [branchName].store
 */
class SingulumStore {
    /**
     * Create shallow clone of store, including stores branched from it, and freeze
     *
     * @param {Object} store
     * @returns {Object}
     */
    constructor(store) {
        forEachObject(store, (value, key) => {
            this[key] = isInstanceOf(value, Singulum) ? value.store : value;
        });

        return this;
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
    constructor(store, $$store, snapshotBranches) {
        forEachObject(store, (value, key) => {
            const $$value = $$store[key];

            this[key] = isInstanceOf($$value, Singulum) && snapshotBranches ?
                new SingulumSnapshot($$value.store, $$value.$$store, snapshotBranches) :
                getClone($$value, SingulumStore);
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
     * @param {Object} leaves
     * @returns {Singulum}
     */
    constructor(leaves = {}) {
        setHidden(this, '$$actions', []);
        setHidden(this, '$$initialValues', {});
        setHidden(this, '$$listener', null);
        setHidden(this, '$$snapshots', {});
        setHidden(this, '$$store', {});

        forEachObject(leaves, (leaf, key) => {
            if (isFunction(leaf)) {
                createNewSingulumLeaf(this, leaf, key);
            } else {
                createNewSingulumLeaf(this, leaf, key);
            }
        });

        return this;
    }
}

/**
 * prototype of Singulum class
 *
 * @type {Object}
 */
Singulum.prototype = Object.create({
    /**
     * Get immutable version of actions
     *
     * @returns {SingulumActions}
     */
    get actions() {
        return new SingulumActions(this.$$actions);
    },

    /**
     * Get immutable version of store
     *
     * @returns {SingulumStore}
     */
    get store() {
        return new SingulumStore(this.$$store);
    },

    /**
     * Create namespaced Singulum child
     *
     * @param {string|Object} namespace
     * @param {Object} leaves
     * @returns {Singulum}
     */
    branch(namespace, leaves) {
        if (!isString(namespace)) {
            namespace = namespace.toString();
        }

        if (!leaves) {
            return this[namespace];
        }

        return createNewSingulumNamespace(this, namespace, leaves);
    },

    /**
     * Convenience method to create multiple branches in one actions,
     * returns array of created branches
     *
     * @param {Array|Object} namespaceMap
     * @returns {Array}
     */
    branches(namespaceMap) {
        let branches = [];

        if (isArray(namespaceMap)) {
            namespaceMap.forEach((branchName) => {
                if (isString(branchName)) {
                    branches.push(this[branchName]);
                }
            });

            return branches;
        }

        forEachObject(namespaceMap, (branch, branchName) => {
            branches.push(createNewSingulumNamespace(this, branchName, branch));
        });

        return branches;
    },

    /**
     * Return singulum to its original state
     *
     * @param {boolean} resetBranches
     * @returns {Singulum}
     */
    reset(resetBranches = false) {
        forEachObject(this.$$store, (value, key) => {
            if (isInstanceOf(value, Singulum) && resetBranches) {
                value.reset();
            } else if (!isInstanceOf(value, SingulumSnapshot)) {
                this.$$store[key] = this.$$initialValues[key];
            }
        });

        if (isFunction(this.$$listener)) {
            this.$$listener(this.store);
        }

        return this;
    },

    /**
     * Restore values in store based on snapshot, optionally restored deeply
     *
     * @param {SingulumSnapshot} snapshot
     * @param {boolean} restoreBranches
     * @returns {Singulum}
     */
    restore(snapshot, restoreBranches = false) {
        if (!isInstanceOf(snapshot, SingulumSnapshot)) {
            throwError('Snapshot used in restore method must be a SingulumSnapshot.');
        }

        forEachObject(snapshot, (value, key) => {
            if (isInstanceOf(value, SingulumSnapshot) && restoreBranches) {
                this.$$store[key].restore(value, restoreBranches);
            } else if (!isInstanceOf(value, SingulumStore)) {
                this.$$store[key] = value;
            }
        });

        if (isFunction(this.$$listener)) {
            this.$$listener(this.store);
        }

        return this;
    },

    /**
     * Create snapshot of current store state, optionally snapshot deeply
     *
     * @param {boolean} snapshotBranches
     * @returns {SingulumSnapshot}
     */
    snapshot(snapshotBranches = false) {
        return new SingulumSnapshot(this.store, this.$$store, snapshotBranches);
    },

    /**
     * Clear out callback bound to $$listener
     *
     * @returns {Singulum}
     */
    unwatch() {
        this.$$listener = null;

        return this;
    },

    /**
     * Add callback to $$listener, to be fired whenever store updates
     *
     * @param {Function} callback
     * @returns {Singulum}
     */
    watch(callback) {
        if (isFunction(callback)) {
            this.$$listener = callback;
        }

        return this;
    }
});

export default Singulum;
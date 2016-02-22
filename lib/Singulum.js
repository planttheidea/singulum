'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OBJECT_ASSIGN = Object.assign;

var namespaceIncrementer = 0;

/**
 * Assigns new result to store, fires listener with new SingulumStore, and returns
 * Promise with new result
 *
 * @param {Object} object
 * @param {string} key
 * @param {*} result
 * @returns {Promise}
 */
var updateStoreValue = function updateStoreValue(object, result, key) {
    /**
     * Apply new result value to the store, scoped if the key is provided
     */
    if (key) {
        object.$$store[key] = result;
    } else {
        object.$$store = result;
    }

    /**
     * If there is a watcher, fire it
     */
    if ((0, _utils.isFunction)(object.$$watcher)) {
        object.$$watcher(object.store);
    }

    return result;
};

/**
 * Creates bound and wrapped function to store new value internally and invoke listener
 * If function is asyncronous, it waits for the promise to be resolved before firing
 *
 * @param {Object} thisArg
 * @param {Function} fn
 * @param {string} key
 * @return {Function}
 */
var createWrapperFunction = function createWrapperFunction(thisArg, fn, key) {
    return (0, _utils.bindFunction)(function () {
        var _this = this;

        var result = fn.apply(undefined, arguments);

        /**
         * If the result is a Promise, wait for resolution and then return the data
         */
        if (result.then) {
            return result.then(function (resultValue) {
                return updateStoreValue(_this, resultValue, key);
            });
        }

        /**
         * Otherwise, wrap the return data in a native Promise and return it
         */
        return Promise.resolve(updateStoreValue(this, result, key));
    }, thisArg);
};

/**
 * Creates namespaced Singulum within the object, aka make a branch
 *
 * @param {Object} object
 * @param {string} namespace
 * @param {Object} actions
 * @param {Object} initialValues
 * @returns {Object}
 */
var createNewSingulumNamespace = function createNewSingulumNamespace(object, namespace) {
    var actions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var initialValues = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    /**
     * if no namespace is provided, use the simple counter to create a unique entry
     */
    if (!namespace) {
        namespace = namespaceIncrementer;
        namespaceIncrementer++;
    }

    (0, _utils.setReadonly)(object, namespace, new Singulum(actions, initialValues));

    object.$$store[namespace] = object[namespace];

    return object[namespace];
};

/**
 * Creates new item in the store, and creates related action with wrapper
 *
 * @param {Object} branch
 * @param {Object} actions
 * @param {Object} initialValues
 */
var createNewSingulumLeaves = function createNewSingulumLeaves(branch) {
    var actions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    (0, _utils.forEachObject)(initialValues, function (initialValue, storeKey) {
        /**
         * Create separate clones for initialValues and store, so that references between
         * the two do not exist
         */
        branch.$$initialValues[storeKey] = (0, _utils.getClone)(initialValue, SingulumStore);
        branch.$$store[storeKey] = (0, _utils.getClone)(initialValue, SingulumStore);
    });

    (0, _utils.forEachObject)(actions, function (action, actionKey) {
        /**
         * if action is a function, then it applies to the entire state
         */
        if ((0, _utils.isFunction)(action)) {
            branch.$$actions[actionKey] = createWrapperFunction(branch, action);
        } else if ((0, _utils.isObject)(action)) {
            /**
             * if action is a map of functions, it applies to a specific key on the store
             */
            (0, _utils.forEachObject)(action, function (actionFn, actionFnKey) {
                branch.$$actions[actionFnKey] = createWrapperFunction(branch, actionFn, actionKey);
            });
        }
    });
};

/**
 * Actions class provided with [branchName].actions
 */

var SingulumActions =
/**
 * Create shallow clone of internal actions, and freeze
 *
 * @param {Object} actions
 * @returns {Object}
 */
function SingulumActions() {
    var actions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SingulumActions);

    OBJECT_ASSIGN(this, actions);

    return this;
};

/**
 * Store class provided with [branchName].store
 */


var SingulumStore =
/**
 * Create shallow clone of store, including stores branched from it, and freeze
 *
 * @param {Object} store
 * @returns {Object}
 */
function SingulumStore() {
    var _this2 = this;

    var store = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SingulumStore);

    (0, _utils.forEachObject)(store, function (value, key) {
        _this2[key] = (0, _utils.isInstanceOf)(value, Singulum) ? value.store : value;
    });

    return this;
};

/**
 * Snapshot class provided with [branchName].snapshot();
 */


var SingulumSnapshot =
/**
 * Create snapshot clone of store, optionally snapshotting deeply
 *
 * @param {SingulumStore} store
 * @param {Singulum} $$store
 * @param {boolean} snapshotBranches
 * @returns {Object}
 */
function SingulumSnapshot() {
    var store = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _this3 = this;

    var $$store = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var snapshotBranches = arguments[2];

    _classCallCheck(this, SingulumSnapshot);

    (0, _utils.forEachObject)(store, function (value, key) {
        var $$value = $$store[key];

        _this3[key] = (0, _utils.isInstanceOf)($$value, Singulum) && snapshotBranches ? new SingulumSnapshot($$value.store, $$value.$$store, snapshotBranches) : (0, _utils.getClone)($$value, SingulumStore);
    });

    return this;
};

/**
 * Main class
 */


var Singulum =
/**
 * Create singulum infrastructure, and populate leaves provided
 *
 * @param {Object} actions
 * @param {Object} initialValues
 * @returns {Singulum}
 */
function Singulum() {
    var actions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var initialValues = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Singulum);

    (0, _utils.setHidden)(this, '$$actions', []);
    (0, _utils.setHidden)(this, '$$initialValues', {});
    (0, _utils.setHidden)(this, '$$watcher', null);
    (0, _utils.setHidden)(this, '$$snapshots', {});
    (0, _utils.setHidden)(this, '$$store', {});

    createNewSingulumLeaves(this, actions, initialValues);

    return this;
};

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
     * @param {Object} actions
     * @param {Object} initialValues
     * @param {string} namespace
     * @returns {Singulum}
     */
    branch: function branch() {
        var actions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var initialValues = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var namespace = arguments[2];

        /**
         * if a namespace is provided but it isn't a string value, make it one
         */
        if (namespace && !(0, _utils.isString)(namespace)) {
            namespace = namespace.toString();
        }

        return createNewSingulumNamespace(this, namespace, actions, initialValues);
    },


    /**
     * Return singulum to its original state
     *
     * @param {boolean} resetBranches
     * @returns {Singulum}
     */
    reset: function reset() {
        var _this4 = this;

        var resetBranches = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        (0, _utils.forEachObject)(this.$$store, function (value, key) {
            if ((0, _utils.isInstanceOf)(value, Singulum) && resetBranches) {
                /**
                 * if snapshot value is a Singulum and you want to reset child branches, then trigger
                 * .reset() on child branch
                 */
                value.reset();
            } else if (!(0, _utils.isInstanceOf)(value, SingulumSnapshot)) {
                /**
                 * If the snapshot value is a non-Singulum value, re-apply it to the store
                 */
                _this4.$$store[key] = _this4.$$initialValues[key];
            }
        });

        /**
         * If there is a watcher, fire it
         */
        if ((0, _utils.isFunction)(this.$$watcher)) {
            this.$$watcher(this.store);
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
    restore: function restore(snapshot) {
        var _this5 = this;

        var restoreBranches = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        /**
         * Make sure snapshot passed is a SingulumSnapshot
         */
        if (!(0, _utils.isInstanceOf)(snapshot, SingulumSnapshot)) {
            (0, _utils.throwError)('Snapshot used in restore method must be a SingulumSnapshot.');
        }

        (0, _utils.forEachObject)(snapshot, function (value, key) {
            if ((0, _utils.isInstanceOf)(value, SingulumSnapshot) && restoreBranches) {
                /**
                 * if the snapshot value is a SingulumSnapshot and you want to reset
                 * child branches, then trigger restore on the child branch passing value
                 * as branch's snapshot
                 */
                _this5.$$store[key].restore(value, restoreBranches);
            } else if (!(0, _utils.isInstanceOf)(value, SingulumStore)) {
                /**
                 * If the snapshot value is not a Singulum, re-apply it to the store
                 */
                _this5.$$store[key] = value;
            }
        });

        /**
         * If there is a watcher, fire it
         */
        if ((0, _utils.isFunction)(this.$$watcher)) {
            this.$$watcher(this.store);
        }

        return this;
    },


    /**
     * Create snapshot of current store state, optionally snapshot deeply
     *
     * @param {boolean} snapshotBranches
     * @returns {SingulumSnapshot}
     */
    snapshot: function snapshot() {
        var snapshotBranches = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        return new SingulumSnapshot(this.store, this.$$store, snapshotBranches);
    },


    /**
     * Clear out callback bound to $$watcher
     *
     * @returns {Singulum}
     */
    unwatch: function unwatch() {
        this.$$watcher = null;

        return this;
    },


    /**
     * Add callback to $$watcher, to be fired whenever store updates
     *
     * @param {Function} callback
     * @returns {Singulum}
     */
    watch: function watch(callback) {
        /**
         * Make sure callback is actually a function before setting it
         */
        if ((0, _utils.isFunction)(callback)) {
            this.$$watcher = callback;
        }

        return this;
    }
});

exports.default = Singulum;
module.exports = exports['default'];
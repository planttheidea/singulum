'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OBJECT_ASSIGN = Object.assign;

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
    if (key) {
        object.$$store[key] = result;
    } else {
        object.$$store = _extends({}, object.$$store, result);
    }

    if ((0, _utils.isFunction)(object.$$listener)) {
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
var createWrapperFunction = function createWrapperFunction(thisArg, fn, key) {
    return (0, _utils.bindFunction)(function () {
        var _this = this;

        var result = fn.apply(undefined, arguments);

        if (result.then) {
            return result.then(function (resultValue) {
                return updateStoreValue(_this, resultValue, key);
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
var createNewSingulumNamespace = function createNewSingulumNamespace(object, namespace, leaves) {
    (0, _utils.setReadonly)(object, namespace, new Singulum(leaves));

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
var createNewSingulumLeaf = function createNewSingulumLeaf(branch, map, key) {
    if (!(0, _utils.isObject)(map) && !(0, _utils.isFunction)(map)) {
        (0, _utils.throwError)('Must provide a map of leaves to branch.');
    }

    /**
     * @note create unique clones for each so that deeply nested object references don't exist
    */
    if ((0, _utils.isObject)(map)) {
        branch.$$initialValues[key] = (0, _utils.getClone)(map.initialValue, SingulumStore);
        branch.$$store[key] = (0, _utils.getClone)(map.initialValue, SingulumStore);

        (0, _utils.forEachObject)(map, function (actionFn, action) {
            if (action !== 'initialValue' && (0, _utils.isFunction)(actionFn)) {
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

var SingulumActions =
/**
 * Create shallow clone of internal actions, and freeze
 *
 * @param {Object} actions
 * @returns {Object}
 */
function SingulumActions(actions) {
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
function SingulumStore(store) {
    var _this2 = this;

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
function SingulumSnapshot(store, $$store, snapshotBranches) {
    var _this3 = this;

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
 * @param {Object} leaves
 * @returns {Singulum}
 */
function Singulum() {
    var _this4 = this;

    var leaves = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Singulum);

    (0, _utils.setHidden)(this, '$$actions', []);
    (0, _utils.setHidden)(this, '$$initialValues', {});
    (0, _utils.setHidden)(this, '$$listener', null);
    (0, _utils.setHidden)(this, '$$snapshots', {});
    (0, _utils.setHidden)(this, '$$store', {});

    (0, _utils.forEachObject)(leaves, function (leaf, key) {
        if ((0, _utils.isFunction)(leaf)) {
            createNewSingulumLeaf(_this4, leaf, key);
        } else {
            createNewSingulumLeaf(_this4, leaf, key);
        }
    });

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
     * @param {string|Object} namespace
     * @param {Object} leaves
     * @returns {Singulum}
     */
    branch: function branch(namespace, leaves) {
        if (!(0, _utils.isString)(namespace)) {
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
    branches: function branches(namespaceMap) {
        var _this5 = this;

        var branches = [];

        if ((0, _utils.isArray)(namespaceMap)) {
            namespaceMap.forEach(function (branchName) {
                if ((0, _utils.isString)(branchName)) {
                    branches.push(_this5[branchName]);
                }
            });

            return branches;
        }

        (0, _utils.forEachObject)(namespaceMap, function (branch, branchName) {
            branches.push(createNewSingulumNamespace(_this5, branchName, branch));
        });

        return branches;
    },


    /**
     * Return singulum to its original state
     *
     * @param {boolean} resetBranches
     * @returns {Singulum}
     */
    reset: function reset() {
        var _this6 = this;

        var resetBranches = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        (0, _utils.forEachObject)(this.$$store, function (value, key) {
            if ((0, _utils.isInstanceOf)(value, Singulum) && resetBranches) {
                value.reset();
            } else if (!(0, _utils.isInstanceOf)(value, SingulumSnapshot)) {
                _this6.$$store[key] = _this6.$$initialValues[key];
            }
        });

        if ((0, _utils.isFunction)(this.$$listener)) {
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
    restore: function restore(snapshot) {
        var _this7 = this;

        var restoreBranches = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        if (!(0, _utils.isInstanceOf)(snapshot, SingulumSnapshot)) {
            (0, _utils.throwError)('Snapshot used in restore method must be a SingulumSnapshot.');
        }

        (0, _utils.forEachObject)(snapshot, function (value, key) {
            if ((0, _utils.isInstanceOf)(value, SingulumSnapshot) && restoreBranches) {
                _this7.$$store[key].restore(value, restoreBranches);
            } else if (!(0, _utils.isInstanceOf)(value, SingulumStore)) {
                _this7.$$store[key] = value;
            }
        });

        if ((0, _utils.isFunction)(this.$$listener)) {
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
    snapshot: function snapshot() {
        var snapshotBranches = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        return new SingulumSnapshot(this.store, this.$$store, snapshotBranches);
    },


    /**
     * Clear out callback bound to $$listener
     *
     * @returns {Singulum}
     */
    unwatch: function unwatch() {
        this.$$listener = null;

        return this;
    },


    /**
     * Add callback to $$listener, to be fired whenever store updates
     *
     * @param {Function} callback
     * @returns {Singulum}
     */
    watch: function watch(callback) {
        if ((0, _utils.isFunction)(callback)) {
            this.$$listener = callback;
        }

        return this;
    }
});

exports.default = Singulum;
module.exports = exports['default'];
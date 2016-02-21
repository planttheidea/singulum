/*!
 * Library: singulum
 * Description: manage your JavaScript application state with predictability and minimal boilerplate
 * Author: Tony Quetano
 * License: MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("singulum", [], factory);
	else if(typeof exports === 'object')
		exports["singulum"] = factory();
	else
		root["singulum"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Singulum = __webpack_require__(2);

	var _Singulum2 = _interopRequireDefault(_Singulum);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = new _Singulum2.default();
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(3);

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
	var updateStoreValue = function updateStoreValue(object, key, result) {
	    object.$$store[key] = result;

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
	                return updateStoreValue(_this, key, resultValue);
	            });
	        }

	        return Promise.resolve(updateStoreValue(this, key, result));
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
	var createNewSingulumLeaf = function createNewSingulumLeaf(branch, key, map) {
	    if (!(0, _utils.isObject)(map)) {
	        (0, _utils.throwError)('Must provide a map of leaves to branch.');
	    }

	    /**
	     * @note create unique clones for each so that deeply nested object references don't exist
	    */
	    branch.$$initialValues[key] = (0, _utils.getClone)(map.initialValue, SingulumStore);
	    branch.$$store[key] = (0, _utils.getClone)(map.initialValue, SingulumStore);

	    (0, _utils.forEachObject)(map, function (actionFn, action) {
	        if (action !== 'initialValue' && (0, _utils.isFunction)(actionFn)) {
	            branch.$$actions[action] = createWrapperFunction(branch, actionFn, key);
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
	        createNewSingulumLeaf(_this4, key, leaf);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var TO_STRING = Object.prototype.toString;

	/**
	 * Binds function to thisArg
	 *
	 * @param {Function} fn
	 * @param {Object} thisArg
	 * @returns {Function}
	 */
	var bindFunction = exports.bindFunction = function bindFunction(fn, thisArg) {
	    return function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return fn.apply(thisArg, args);
	    };
	};

	/**
	 * Provided as faster alternative for native .forEach
	 *
	 * @param {Array} array
	 * @param {Function} fn
	 */
	var forEachObject = exports.forEachObject = function forEachObject(object, fn) {
	    var keysArray = Object.keys(object);

	    for (var index = 0, length = keysArray.length; index < length; index++) {
	        var key = keysArray[index];

	        fn(object[key], key, object);
	    }
	};

	/**
	 * Determines if object is of type Array
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	var isArray = exports.isArray = function isArray(object) {
	    return TO_STRING.call(object) === '[object Array]';
	};

	/**
	 * Determines if object is of type Date
	 * Not exported because not used elsewhere
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	var isDate = function isDate(object) {
	    return TO_STRING.call(object) === '[object Date]';
	};

	/**
	 * Determines if object is of type Function
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	var isFunction = exports.isFunction = function isFunction(object) {
	    return TO_STRING.call(object) === '[object Function]' || typeof object === 'function';
	};

	/**
	 * Determine if object is instance of Constructor
	 *
	 * @param {*} object
	 * @param {Function} Constructor
	 * @returns {boolean}
	 */
	var isInstanceOf = exports.isInstanceOf = function isInstanceOf(object, Constructor) {
	    return object instanceof Constructor;
	};

	/**
	 * Determines if object is of type Object
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	var isObject = exports.isObject = function isObject(object) {
	    return TO_STRING.call(object) === '[object Object]' && !!object;
	};

	/**
	 * Determines if object is of type String
	 *
	 * @param {*} object
	 * @returns {boolean}
	 */
	var isString = exports.isString = function isString(object) {
	    return TO_STRING.call(object) === '[object String]';
	};

	/**
	 * Returns clone of Singulum object with metadata stripped and child
	 * stores with SingulumStore class applied
	 *
	 * @param {*} object
	 * @param {SingulumStore} SingulumStore
	 * @returns {*}
	 */
	var getClone = exports.getClone = function getClone(object, SingulumStore) {
	    if (isArray(object)) {
	        return object.map(function (item) {
	            return getClone(item, SingulumStore);
	        });
	    }

	    if (isObject(object)) {
	        var _ret = function () {
	            var cloneObject = {};

	            forEachObject(object, function (value, key) {
	                cloneObject[key] = getClone(value, SingulumStore);
	            });

	            if (isInstanceOf(object, SingulumStore)) {
	                cloneObject = new SingulumStore(cloneObject);
	            }

	            return {
	                v: cloneObject
	            };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }

	    if (isDate(object)) {
	        return new Date(object.valueOf());
	    }

	    return object;
	};

	/**
	 * Set property to be non-enumerable
	 *
	 * @param {Object} object
	 * @param {string} property
	 * @param {*} value
	 */
	var setHidden = exports.setHidden = function setHidden(object, property, value) {
	    Object.defineProperty(object, property, {
	        configurable: true,
	        enumerable: false,
	        value: value,
	        writable: true
	    });
	};

	/**
	 * Set property on object as getter only, making it immutable
	 *
	 * @param {Object} object
	 * @param {string} property
	 * @param {*} value
	 */
	var setReadonly = exports.setReadonly = function setReadonly(object, property, value) {
	    Object.defineProperty(object, property, {
	        get: function get() {
	            return value;
	        },
	        set: function set() {
	            throwError('Cannot set a value for ' + property + ', as it is immutable.');
	        }
	    });
	};

	/**
	 * Consolidated error throwing function, mainly for minification benefits
	 *
	 * @param {string} error
	 */
	var throwError = exports.throwError = function throwError(error) {
	    throw new Error(error);
	};

	exports.default = {
	    bindFunction: bindFunction,
	    forEachObject: forEachObject,
	    getClone: getClone,
	    isArray: isArray,
	    isFunction: isFunction,
	    isInstanceOf: isInstanceOf,
	    isObject: isObject,
	    isString: isString,
	    setHidden: setHidden,
	    setReadonly: setReadonly,
	    throwError: throwError
	};

/***/ }
/******/ ])
});
;
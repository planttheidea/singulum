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

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _Singulum = __webpack_require__(2);\n\nvar _Singulum2 = _interopRequireDefault(_Singulum);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = new _Singulum2.default();\nmodule.exports = exports['default'];\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvaW5kZXguanM/MWZkZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2luZ3VsdW0gZnJvbSAnLi9TaW5ndWx1bSc7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTaW5ndWx1bSgpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHNyYy9pbmRleC5qc1xuICoqLyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUE7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _utils = __webpack_require__(3);\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar OBJECT_ASSIGN = Object.assign;\n\n/**\n * Assigns new result to store, fires listener with new SingulumStore, and returns\n * Promise with new result\n *\n * @param {Object} object\n * @param {string} key\n * @param {*} result\n * @returns {Promise}\n */\nvar updateStoreValue = function updateStoreValue(object, result, key) {\n    if (key) {\n        object.$$store[key] = result;\n    } else {\n        object.$$store = _extends({}, object.$$store, result);\n    }\n\n    if ((0, _utils.isFunction)(object.$$listener)) {\n        object.$$listener(object.store);\n    }\n\n    return result;\n};\n\n/**\n * Creates bound and wrapped function to store new value internally and invoke listener\n * If function is asyncronous, it waits for the promise to be resolved before firing\n *\n * @param {Function} fn\n * @param {string} key\n * @return {Function}\n */\nvar createWrapperFunction = function createWrapperFunction(thisArg, fn, key) {\n    return (0, _utils.bindFunction)(function () {\n        var _this = this;\n\n        var result = fn.apply(undefined, arguments);\n\n        if (result.then) {\n            return result.then(function (resultValue) {\n                return updateStoreValue(_this, resultValue, key);\n            });\n        }\n\n        return Promise.resolve(updateStoreValue(this, result, key));\n    }, thisArg);\n};\n\n/**\n * Creates namespaced Singulum within the object, aka make a branch\n *\n * @param {Object} object\n * @param {string} namespace\n * @param {Object} leaves\n * @returns {Object}\n */\nvar createNewSingulumNamespace = function createNewSingulumNamespace(object, namespace, leaves) {\n    (0, _utils.setReadonly)(object, namespace, new Singulum(leaves));\n\n    object.$$store[namespace] = object[namespace];\n\n    return object[namespace];\n};\n\n/**\n * Creates new item in the store, and creates related action with wrapper\n *\n * @param {Object} branch\n * @param {string} key\n * @param {Object} map\n */\nvar createNewSingulumLeaf = function createNewSingulumLeaf(branch, map, key) {\n    if (!(0, _utils.isObject)(map) && !(0, _utils.isFunction)(map)) {\n        (0, _utils.throwError)('Must provide a map of leaves to branch.');\n    }\n\n    /**\n     * @note create unique clones for each so that deeply nested object references don't exist\n    */\n    if ((0, _utils.isObject)(map)) {\n        branch.$$initialValues[key] = (0, _utils.getClone)(map.initialValue, SingulumStore);\n        branch.$$store[key] = (0, _utils.getClone)(map.initialValue, SingulumStore);\n\n        (0, _utils.forEachObject)(map, function (actionFn, action) {\n            if (action !== 'initialValue' && (0, _utils.isFunction)(actionFn)) {\n                branch.$$actions[action] = createWrapperFunction(branch, actionFn, key);\n            }\n        });\n    } else {\n        branch.$$actions[key] = createWrapperFunction(branch, map);\n    }\n};\n\n/**\n * Actions class provided with [branchName].actions\n */\n\nvar SingulumActions =\n/**\n * Create shallow clone of internal actions, and freeze\n *\n * @param {Object} actions\n * @returns {Object}\n */\nfunction SingulumActions(actions) {\n    _classCallCheck(this, SingulumActions);\n\n    OBJECT_ASSIGN(this, actions);\n\n    return this;\n};\n\n/**\n * Store class provided with [branchName].store\n */\n\n\nvar SingulumStore =\n/**\n * Create shallow clone of store, including stores branched from it, and freeze\n *\n * @param {Object} store\n * @returns {Object}\n */\nfunction SingulumStore(store) {\n    var _this2 = this;\n\n    _classCallCheck(this, SingulumStore);\n\n    (0, _utils.forEachObject)(store, function (value, key) {\n        _this2[key] = (0, _utils.isInstanceOf)(value, Singulum) ? value.store : value;\n    });\n\n    return this;\n};\n\n/**\n * Snapshot class provided with [branchName].snapshot();\n */\n\n\nvar SingulumSnapshot =\n/**\n * Create snapshot clone of store, optionally snapshotting deeply\n *\n * @param {SingulumStore} store\n * @param {Singulum} $$store\n * @param {boolean} snapshotBranches\n * @returns {Object}\n */\nfunction SingulumSnapshot(store, $$store, snapshotBranches) {\n    var _this3 = this;\n\n    _classCallCheck(this, SingulumSnapshot);\n\n    (0, _utils.forEachObject)(store, function (value, key) {\n        var $$value = $$store[key];\n\n        _this3[key] = (0, _utils.isInstanceOf)($$value, Singulum) && snapshotBranches ? new SingulumSnapshot($$value.store, $$value.$$store, snapshotBranches) : (0, _utils.getClone)($$value, SingulumStore);\n    });\n\n    return this;\n};\n\n/**\n * Main class\n */\n\n\nvar Singulum =\n/**\n * Create singulum infrastructure, and populate leaves provided\n *\n * @param {Object} leaves\n * @returns {Singulum}\n */\nfunction Singulum() {\n    var _this4 = this;\n\n    var leaves = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n    _classCallCheck(this, Singulum);\n\n    (0, _utils.setHidden)(this, '$$actions', []);\n    (0, _utils.setHidden)(this, '$$initialValues', {});\n    (0, _utils.setHidden)(this, '$$listener', null);\n    (0, _utils.setHidden)(this, '$$snapshots', {});\n    (0, _utils.setHidden)(this, '$$store', {});\n\n    (0, _utils.forEachObject)(leaves, function (leaf, key) {\n        if ((0, _utils.isFunction)(leaf)) {\n            createNewSingulumLeaf(_this4, leaf, key);\n        } else {\n            createNewSingulumLeaf(_this4, leaf, key);\n        }\n    });\n\n    return this;\n};\n\n/**\n * prototype of Singulum class\n *\n * @type {Object}\n */\n\n\nSingulum.prototype = Object.create({\n    /**\n     * Get immutable version of actions\n     *\n     * @returns {SingulumActions}\n     */\n    get actions() {\n        return new SingulumActions(this.$$actions);\n    },\n\n    /**\n     * Get immutable version of store\n     *\n     * @returns {SingulumStore}\n     */\n    get store() {\n        return new SingulumStore(this.$$store);\n    },\n\n    /**\n     * Create namespaced Singulum child\n     *\n     * @param {string|Object} namespace\n     * @param {Object} leaves\n     * @returns {Singulum}\n     */\n    branch: function branch(namespace, leaves) {\n        if (!(0, _utils.isString)(namespace)) {\n            namespace = namespace.toString();\n        }\n\n        if (!leaves) {\n            return this[namespace];\n        }\n\n        return createNewSingulumNamespace(this, namespace, leaves);\n    },\n\n\n    /**\n     * Convenience method to create multiple branches in one actions,\n     * returns array of created branches\n     *\n     * @param {Array|Object} namespaceMap\n     * @returns {Array}\n     */\n    branches: function branches(namespaceMap) {\n        var _this5 = this;\n\n        var branches = [];\n\n        if ((0, _utils.isArray)(namespaceMap)) {\n            namespaceMap.forEach(function (branchName) {\n                if ((0, _utils.isString)(branchName)) {\n                    branches.push(_this5[branchName]);\n                }\n            });\n\n            return branches;\n        }\n\n        (0, _utils.forEachObject)(namespaceMap, function (branch, branchName) {\n            branches.push(createNewSingulumNamespace(_this5, branchName, branch));\n        });\n\n        return branches;\n    },\n\n\n    /**\n     * Return singulum to its original state\n     *\n     * @param {boolean} resetBranches\n     * @returns {Singulum}\n     */\n    reset: function reset() {\n        var _this6 = this;\n\n        var resetBranches = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n\n        (0, _utils.forEachObject)(this.$$store, function (value, key) {\n            if ((0, _utils.isInstanceOf)(value, Singulum) && resetBranches) {\n                value.reset();\n            } else if (!(0, _utils.isInstanceOf)(value, SingulumSnapshot)) {\n                _this6.$$store[key] = _this6.$$initialValues[key];\n            }\n        });\n\n        if ((0, _utils.isFunction)(this.$$listener)) {\n            this.$$listener(this.store);\n        }\n\n        return this;\n    },\n\n\n    /**\n     * Restore values in store based on snapshot, optionally restored deeply\n     *\n     * @param {SingulumSnapshot} snapshot\n     * @param {boolean} restoreBranches\n     * @returns {Singulum}\n     */\n    restore: function restore(snapshot) {\n        var _this7 = this;\n\n        var restoreBranches = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];\n\n        if (!(0, _utils.isInstanceOf)(snapshot, SingulumSnapshot)) {\n            (0, _utils.throwError)('Snapshot used in restore method must be a SingulumSnapshot.');\n        }\n\n        (0, _utils.forEachObject)(snapshot, function (value, key) {\n            if ((0, _utils.isInstanceOf)(value, SingulumSnapshot) && restoreBranches) {\n                _this7.$$store[key].restore(value, restoreBranches);\n            } else if (!(0, _utils.isInstanceOf)(value, SingulumStore)) {\n                _this7.$$store[key] = value;\n            }\n        });\n\n        if ((0, _utils.isFunction)(this.$$listener)) {\n            this.$$listener(this.store);\n        }\n\n        return this;\n    },\n\n\n    /**\n     * Create snapshot of current store state, optionally snapshot deeply\n     *\n     * @param {boolean} snapshotBranches\n     * @returns {SingulumSnapshot}\n     */\n    snapshot: function snapshot() {\n        var snapshotBranches = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n\n        return new SingulumSnapshot(this.store, this.$$store, snapshotBranches);\n    },\n\n\n    /**\n     * Clear out callback bound to $$listener\n     *\n     * @returns {Singulum}\n     */\n    unwatch: function unwatch() {\n        this.$$listener = null;\n\n        return this;\n    },\n\n\n    /**\n     * Add callback to $$listener, to be fired whenever store updates\n     *\n     * @param {Function} callback\n     * @returns {Singulum}\n     */\n    watch: function watch(callback) {\n        if ((0, _utils.isFunction)(callback)) {\n            this.$$listener = callback;\n        }\n\n        return this;\n    }\n});\n\nexports.default = Singulum;\nmodule.exports = exports['default'];\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvU2luZ3VsdW0uanM/ZGRiYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIGJpbmRGdW5jdGlvbixcbiAgICBmb3JFYWNoT2JqZWN0LFxuICAgIGdldENsb25lLFxuICAgIGlzQXJyYXksXG4gICAgaXNGdW5jdGlvbixcbiAgICBpc0luc3RhbmNlT2YsXG4gICAgaXNPYmplY3QsXG4gICAgaXNTdHJpbmcsXG4gICAgc2V0SGlkZGVuLFxuICAgIHNldFJlYWRvbmx5LFxuICAgIHRocm93RXJyb3Jcbn0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IE9CSkVDVF9BU1NJR04gPSBPYmplY3QuYXNzaWduO1xuXG4vKipcbiAqIEFzc2lnbnMgbmV3IHJlc3VsdCB0byBzdG9yZSwgZmlyZXMgbGlzdGVuZXIgd2l0aCBuZXcgU2luZ3VsdW1TdG9yZSwgYW5kIHJldHVybnNcbiAqIFByb21pc2Ugd2l0aCBuZXcgcmVzdWx0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSByZXN1bHRcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5jb25zdCB1cGRhdGVTdG9yZVZhbHVlID0gKG9iamVjdCwgcmVzdWx0LCBrZXkpID0+IHtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIG9iamVjdC4kJHN0b3JlW2tleV0gPSByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0LiQkc3RvcmUgPSB7XG4gICAgICAgICAgICAuLi5vYmplY3QuJCRzdG9yZSxcbiAgICAgICAgICAgIC4uLnJlc3VsdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKG9iamVjdC4kJGxpc3RlbmVyKSkge1xuICAgICAgICBvYmplY3QuJCRsaXN0ZW5lcihvYmplY3Quc3RvcmUpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYm91bmQgYW5kIHdyYXBwZWQgZnVuY3Rpb24gdG8gc3RvcmUgbmV3IHZhbHVlIGludGVybmFsbHkgYW5kIGludm9rZSBsaXN0ZW5lclxuICogSWYgZnVuY3Rpb24gaXMgYXN5bmNyb25vdXMsIGl0IHdhaXRzIGZvciB0aGUgcHJvbWlzZSB0byBiZSByZXNvbHZlZCBiZWZvcmUgZmlyaW5nXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5jb25zdCBjcmVhdGVXcmFwcGVyRnVuY3Rpb24gPSBmdW5jdGlvbih0aGlzQXJnLCBmbiwga2V5KSB7XG4gICAgcmV0dXJuIGJpbmRGdW5jdGlvbihmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZuKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChyZXN1bHQudGhlbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChyZXN1bHRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVTdG9yZVZhbHVlKHRoaXMsIHJlc3VsdFZhbHVlLCBrZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZVN0b3JlVmFsdWUodGhpcywgcmVzdWx0LCBrZXkpKTtcbiAgICB9LCB0aGlzQXJnKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBuYW1lc3BhY2VkIFNpbmd1bHVtIHdpdGhpbiB0aGUgb2JqZWN0LCBha2EgbWFrZSBhIGJyYW5jaFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lc3BhY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBsZWF2ZXNcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IGNyZWF0ZU5ld1Npbmd1bHVtTmFtZXNwYWNlID0gKG9iamVjdCwgbmFtZXNwYWNlLCBsZWF2ZXMpID0+IHtcbiAgICBzZXRSZWFkb25seShvYmplY3QsIG5hbWVzcGFjZSwgbmV3IFNpbmd1bHVtKGxlYXZlcykpO1xuXG4gICAgb2JqZWN0LiQkc3RvcmVbbmFtZXNwYWNlXSA9IG9iamVjdFtuYW1lc3BhY2VdO1xuXG4gICAgcmV0dXJuIG9iamVjdFtuYW1lc3BhY2VdO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIG5ldyBpdGVtIGluIHRoZSBzdG9yZSwgYW5kIGNyZWF0ZXMgcmVsYXRlZCBhY3Rpb24gd2l0aCB3cmFwcGVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJyYW5jaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHBhcmFtIHtPYmplY3R9IG1hcFxuICovXG5jb25zdCBjcmVhdGVOZXdTaW5ndWx1bUxlYWYgPSAoYnJhbmNoLCBtYXAsIGtleSkgPT4ge1xuICAgIGlmICghaXNPYmplY3QobWFwKSAmJiAhaXNGdW5jdGlvbihtYXApKSB7XG4gICAgICAgIHRocm93RXJyb3IoJ011c3QgcHJvdmlkZSBhIG1hcCBvZiBsZWF2ZXMgdG8gYnJhbmNoLicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBub3RlIGNyZWF0ZSB1bmlxdWUgY2xvbmVzIGZvciBlYWNoIHNvIHRoYXQgZGVlcGx5IG5lc3RlZCBvYmplY3QgcmVmZXJlbmNlcyBkb24ndCBleGlzdFxuICAgICovXG4gICAgaWYgKGlzT2JqZWN0KG1hcCkpIHtcbiAgICAgICAgYnJhbmNoLiQkaW5pdGlhbFZhbHVlc1trZXldID0gZ2V0Q2xvbmUobWFwLmluaXRpYWxWYWx1ZSwgU2luZ3VsdW1TdG9yZSk7XG4gICAgICAgIGJyYW5jaC4kJHN0b3JlW2tleV0gPSBnZXRDbG9uZShtYXAuaW5pdGlhbFZhbHVlLCBTaW5ndWx1bVN0b3JlKTtcblxuICAgICAgICBmb3JFYWNoT2JqZWN0KG1hcCwgKGFjdGlvbkZuLCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGlmIChhY3Rpb24gIT09ICdpbml0aWFsVmFsdWUnICYmIGlzRnVuY3Rpb24oYWN0aW9uRm4pKSB7XG4gICAgICAgICAgICAgICAgYnJhbmNoLiQkYWN0aW9uc1thY3Rpb25dID0gY3JlYXRlV3JhcHBlckZ1bmN0aW9uKGJyYW5jaCwgYWN0aW9uRm4sIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJyYW5jaC4kJGFjdGlvbnNba2V5XSA9IGNyZWF0ZVdyYXBwZXJGdW5jdGlvbihicmFuY2gsIG1hcCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBBY3Rpb25zIGNsYXNzIHByb3ZpZGVkIHdpdGggW2JyYW5jaE5hbWVdLmFjdGlvbnNcbiAqL1xuY2xhc3MgU2luZ3VsdW1BY3Rpb25zIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgc2hhbGxvdyBjbG9uZSBvZiBpbnRlcm5hbCBhY3Rpb25zLCBhbmQgZnJlZXplXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uc1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYWN0aW9ucykge1xuICAgICAgICBPQkpFQ1RfQVNTSUdOKHRoaXMsIGFjdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTdG9yZSBjbGFzcyBwcm92aWRlZCB3aXRoIFticmFuY2hOYW1lXS5zdG9yZVxuICovXG5jbGFzcyBTaW5ndWx1bVN0b3JlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgc2hhbGxvdyBjbG9uZSBvZiBzdG9yZSwgaW5jbHVkaW5nIHN0b3JlcyBicmFuY2hlZCBmcm9tIGl0LCBhbmQgZnJlZXplXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3RvcmVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0b3JlKSB7XG4gICAgICAgIGZvckVhY2hPYmplY3Qoc3RvcmUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBpc0luc3RhbmNlT2YodmFsdWUsIFNpbmd1bHVtKSA/IHZhbHVlLnN0b3JlIDogdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTbmFwc2hvdCBjbGFzcyBwcm92aWRlZCB3aXRoIFticmFuY2hOYW1lXS5zbmFwc2hvdCgpO1xuICovXG5jbGFzcyBTaW5ndWx1bVNuYXBzaG90IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgc25hcHNob3QgY2xvbmUgb2Ygc3RvcmUsIG9wdGlvbmFsbHkgc25hcHNob3R0aW5nIGRlZXBseVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaW5ndWx1bVN0b3JlfSBzdG9yZVxuICAgICAqIEBwYXJhbSB7U2luZ3VsdW19ICQkc3RvcmVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNuYXBzaG90QnJhbmNoZXNcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0b3JlLCAkJHN0b3JlLCBzbmFwc2hvdEJyYW5jaGVzKSB7XG4gICAgICAgIGZvckVhY2hPYmplY3Qoc3RvcmUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkJHZhbHVlID0gJCRzdG9yZVtrZXldO1xuXG4gICAgICAgICAgICB0aGlzW2tleV0gPSBpc0luc3RhbmNlT2YoJCR2YWx1ZSwgU2luZ3VsdW0pICYmIHNuYXBzaG90QnJhbmNoZXMgP1xuICAgICAgICAgICAgICAgIG5ldyBTaW5ndWx1bVNuYXBzaG90KCQkdmFsdWUuc3RvcmUsICQkdmFsdWUuJCRzdG9yZSwgc25hcHNob3RCcmFuY2hlcykgOlxuICAgICAgICAgICAgICAgIGdldENsb25lKCQkdmFsdWUsIFNpbmd1bHVtU3RvcmUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbi8qKlxuICogTWFpbiBjbGFzc1xuICovXG5jbGFzcyBTaW5ndWx1bSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHNpbmd1bHVtIGluZnJhc3RydWN0dXJlLCBhbmQgcG9wdWxhdGUgbGVhdmVzIHByb3ZpZGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbGVhdmVzXG4gICAgICogQHJldHVybnMge1Npbmd1bHVtfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxlYXZlcyA9IHt9KSB7XG4gICAgICAgIHNldEhpZGRlbih0aGlzLCAnJCRhY3Rpb25zJywgW10pO1xuICAgICAgICBzZXRIaWRkZW4odGhpcywgJyQkaW5pdGlhbFZhbHVlcycsIHt9KTtcbiAgICAgICAgc2V0SGlkZGVuKHRoaXMsICckJGxpc3RlbmVyJywgbnVsbCk7XG4gICAgICAgIHNldEhpZGRlbih0aGlzLCAnJCRzbmFwc2hvdHMnLCB7fSk7XG4gICAgICAgIHNldEhpZGRlbih0aGlzLCAnJCRzdG9yZScsIHt9KTtcblxuICAgICAgICBmb3JFYWNoT2JqZWN0KGxlYXZlcywgKGxlYWYsIGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24obGVhZikpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVOZXdTaW5ndWx1bUxlYWYodGhpcywgbGVhZiwga2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTmV3U2luZ3VsdW1MZWFmKHRoaXMsIGxlYWYsIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLyoqXG4gKiBwcm90b3R5cGUgb2YgU2luZ3VsdW0gY2xhc3NcbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5TaW5ndWx1bS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHtcbiAgICAvKipcbiAgICAgKiBHZXQgaW1tdXRhYmxlIHZlcnNpb24gb2YgYWN0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybnMge1Npbmd1bHVtQWN0aW9uc31cbiAgICAgKi9cbiAgICBnZXQgYWN0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTaW5ndWx1bUFjdGlvbnModGhpcy4kJGFjdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgaW1tdXRhYmxlIHZlcnNpb24gb2Ygc3RvcmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTaW5ndWx1bVN0b3JlfVxuICAgICAqL1xuICAgIGdldCBzdG9yZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTaW5ndWx1bVN0b3JlKHRoaXMuJCRzdG9yZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBuYW1lc3BhY2VkIFNpbmd1bHVtIGNoaWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IG5hbWVzcGFjZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsZWF2ZXNcbiAgICAgKiBAcmV0dXJucyB7U2luZ3VsdW19XG4gICAgICovXG4gICAgYnJhbmNoKG5hbWVzcGFjZSwgbGVhdmVzKSB7XG4gICAgICAgIGlmICghaXNTdHJpbmcobmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgbmFtZXNwYWNlID0gbmFtZXNwYWNlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxlYXZlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbbmFtZXNwYWNlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjcmVhdGVOZXdTaW5ndWx1bU5hbWVzcGFjZSh0aGlzLCBuYW1lc3BhY2UsIGxlYXZlcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgbXVsdGlwbGUgYnJhbmNoZXMgaW4gb25lIGFjdGlvbnMsXG4gICAgICogcmV0dXJucyBhcnJheSBvZiBjcmVhdGVkIGJyYW5jaGVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gbmFtZXNwYWNlTWFwXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGJyYW5jaGVzKG5hbWVzcGFjZU1hcCkge1xuICAgICAgICBsZXQgYnJhbmNoZXMgPSBbXTtcblxuICAgICAgICBpZiAoaXNBcnJheShuYW1lc3BhY2VNYXApKSB7XG4gICAgICAgICAgICBuYW1lc3BhY2VNYXAuZm9yRWFjaCgoYnJhbmNoTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0cmluZyhicmFuY2hOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlcy5wdXNoKHRoaXNbYnJhbmNoTmFtZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYnJhbmNoZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JFYWNoT2JqZWN0KG5hbWVzcGFjZU1hcCwgKGJyYW5jaCwgYnJhbmNoTmFtZSkgPT4ge1xuICAgICAgICAgICAgYnJhbmNoZXMucHVzaChjcmVhdGVOZXdTaW5ndWx1bU5hbWVzcGFjZSh0aGlzLCBicmFuY2hOYW1lLCBicmFuY2gpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGJyYW5jaGVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gc2luZ3VsdW0gdG8gaXRzIG9yaWdpbmFsIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlc2V0QnJhbmNoZXNcbiAgICAgKiBAcmV0dXJucyB7U2luZ3VsdW19XG4gICAgICovXG4gICAgcmVzZXQocmVzZXRCcmFuY2hlcyA9IGZhbHNlKSB7XG4gICAgICAgIGZvckVhY2hPYmplY3QodGhpcy4kJHN0b3JlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzSW5zdGFuY2VPZih2YWx1ZSwgU2luZ3VsdW0pICYmIHJlc2V0QnJhbmNoZXMpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5yZXNldCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNJbnN0YW5jZU9mKHZhbHVlLCBTaW5ndWx1bVNuYXBzaG90KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCRzdG9yZVtrZXldID0gdGhpcy4kJGluaXRpYWxWYWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpcy4kJGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgdGhpcy4kJGxpc3RlbmVyKHRoaXMuc3RvcmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmUgdmFsdWVzIGluIHN0b3JlIGJhc2VkIG9uIHNuYXBzaG90LCBvcHRpb25hbGx5IHJlc3RvcmVkIGRlZXBseVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTaW5ndWx1bVNuYXBzaG90fSBzbmFwc2hvdFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzdG9yZUJyYW5jaGVzXG4gICAgICogQHJldHVybnMge1Npbmd1bHVtfVxuICAgICAqL1xuICAgIHJlc3RvcmUoc25hcHNob3QsIHJlc3RvcmVCcmFuY2hlcyA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghaXNJbnN0YW5jZU9mKHNuYXBzaG90LCBTaW5ndWx1bVNuYXBzaG90KSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcignU25hcHNob3QgdXNlZCBpbiByZXN0b3JlIG1ldGhvZCBtdXN0IGJlIGEgU2luZ3VsdW1TbmFwc2hvdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvckVhY2hPYmplY3Qoc25hcHNob3QsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNJbnN0YW5jZU9mKHZhbHVlLCBTaW5ndWx1bVNuYXBzaG90KSAmJiByZXN0b3JlQnJhbmNoZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiQkc3RvcmVba2V5XS5yZXN0b3JlKHZhbHVlLCByZXN0b3JlQnJhbmNoZXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNJbnN0YW5jZU9mKHZhbHVlLCBTaW5ndWx1bVN0b3JlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCRzdG9yZVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXMuJCRsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIHRoaXMuJCRsaXN0ZW5lcih0aGlzLnN0b3JlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgc25hcHNob3Qgb2YgY3VycmVudCBzdG9yZSBzdGF0ZSwgb3B0aW9uYWxseSBzbmFwc2hvdCBkZWVwbHlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc25hcHNob3RCcmFuY2hlc1xuICAgICAqIEByZXR1cm5zIHtTaW5ndWx1bVNuYXBzaG90fVxuICAgICAqL1xuICAgIHNuYXBzaG90KHNuYXBzaG90QnJhbmNoZXMgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gbmV3IFNpbmd1bHVtU25hcHNob3QodGhpcy5zdG9yZSwgdGhpcy4kJHN0b3JlLCBzbmFwc2hvdEJyYW5jaGVzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgb3V0IGNhbGxiYWNrIGJvdW5kIHRvICQkbGlzdGVuZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTaW5ndWx1bX1cbiAgICAgKi9cbiAgICB1bndhdGNoKCkge1xuICAgICAgICB0aGlzLiQkbGlzdGVuZXIgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgY2FsbGJhY2sgdG8gJCRsaXN0ZW5lciwgdG8gYmUgZmlyZWQgd2hlbmV2ZXIgc3RvcmUgdXBkYXRlc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7U2luZ3VsdW19XG4gICAgICovXG4gICAgd2F0Y2goY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICB0aGlzLiQkbGlzdGVuZXIgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTaW5ndWx1bTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBzcmMvU2luZ3VsdW0uanNcbiAqKi8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQWNBO0FBQ0E7Ozs7Ozs7Ozs7QUFVQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBSEE7QUFDQTtBQVFBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFkQTtBQUNBOzs7Ozs7Ozs7QUF3QkE7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFDQTtBQUtBO0FBVEE7QUFEQTtBQUNBOzs7Ozs7Ozs7QUFxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFDQTs7Ozs7Ozs7QUFjQTtBQUNBO0FBQ0E7QUFEQTtBQUNBOzs7O0FBRkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBSkE7QUFVQTtBQVZBO0FBUkE7QUFDQTs7Ozs7QUF3QkE7Ozs7Ozs7QUFPQTtBQVBBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFIQTtBQUNBOzs7Ozs7QUFTQTs7Ozs7OztBQU9BOzs7QUFQQTtBQUNBO0FBT0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUxBO0FBQ0E7Ozs7OztBQVdBOzs7Ozs7Ozs7QUFTQTs7O0FBVEE7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQU9BO0FBVEE7QUFDQTs7Ozs7O0FBZUE7Ozs7Ozs7QUFPQTs7O0FBQUE7QUFDQTtBQVJBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBSEE7QUFEQTtBQUNBO0FBT0E7QUFmQTtBQUNBOzs7Ozs7OztBQXVCQTs7Ozs7O0FBTUE7QUFDQTtBQURBO0FBQ0E7Ozs7OztBQVFBO0FBQ0E7QUFEQTtBQUNBOzs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBbkNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUEyQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFDQTtBQUtBO0FBUEE7QUFDQTtBQVNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUE5REE7QUFDQTtBQUNBOzs7Ozs7O0FBcUVBOzs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBREE7QUFHQTtBQURBO0FBSEE7QUFDQTtBQU9BO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFwRkE7QUFDQTtBQUNBOzs7Ozs7OztBQTRGQTs7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQURBO0FBSEE7QUFDQTtBQU9BO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUEvR0E7QUFDQTtBQUNBOzs7Ozs7O0FBc0hBO0FBQUE7QUFDQTtBQUFBO0FBekhBO0FBQ0E7QUFDQTs7Ozs7O0FBK0hBO0FBQ0E7QUFDQTtBQUNBO0FBcElBO0FBQ0E7QUFDQTs7Ozs7OztBQTJJQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFsSkE7QUFBQTtBQUNBO0FBcUpBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\nvar TO_STRING = Object.prototype.toString;\n\n/**\n * Binds function to thisArg\n *\n * @param {Function} fn\n * @param {Object} thisArg\n * @returns {Function}\n */\nvar bindFunction = exports.bindFunction = function bindFunction(fn, thisArg) {\n    return function () {\n        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n            args[_key] = arguments[_key];\n        }\n\n        return fn.apply(thisArg, args);\n    };\n};\n\n/**\n * Provided as faster alternative for native .forEach\n *\n * @param {Array} array\n * @param {Function} fn\n */\nvar forEachObject = exports.forEachObject = function forEachObject(object, fn) {\n    var keysArray = Object.keys(object);\n\n    for (var index = 0, length = keysArray.length; index < length; index++) {\n        var key = keysArray[index];\n\n        fn(object[key], key, object);\n    }\n};\n\n/**\n * Determines if object is of type Array\n *\n * @param {*} object\n * @returns {boolean}\n */\nvar isArray = exports.isArray = function isArray(object) {\n    return TO_STRING.call(object) === '[object Array]';\n};\n\n/**\n * Determines if object is of type Date\n * Not exported because not used elsewhere\n *\n * @param {*} object\n * @returns {boolean}\n */\nvar isDate = function isDate(object) {\n    return TO_STRING.call(object) === '[object Date]';\n};\n\n/**\n * Determines if object is of type Function\n *\n * @param {*} object\n * @returns {boolean}\n */\nvar isFunction = exports.isFunction = function isFunction(object) {\n    return TO_STRING.call(object) === '[object Function]' || typeof object === 'function';\n};\n\n/**\n * Determine if object is instance of Constructor\n *\n * @param {*} object\n * @param {Function} Constructor\n * @returns {boolean}\n */\nvar isInstanceOf = exports.isInstanceOf = function isInstanceOf(object, Constructor) {\n    return object instanceof Constructor;\n};\n\n/**\n * Determines if object is of type Object\n *\n * @param {*} object\n * @returns {boolean}\n */\nvar isObject = exports.isObject = function isObject(object) {\n    return TO_STRING.call(object) === '[object Object]' && !!object;\n};\n\n/**\n * Determines if object is of type String\n *\n * @param {*} object\n * @returns {boolean}\n */\nvar isString = exports.isString = function isString(object) {\n    return TO_STRING.call(object) === '[object String]';\n};\n\n/**\n * Returns clone of Singulum object with metadata stripped and child\n * stores with SingulumStore class applied\n *\n * @param {*} object\n * @param {SingulumStore} SingulumStore\n * @returns {*}\n */\nvar getClone = exports.getClone = function getClone(object, SingulumStore) {\n    if (isArray(object)) {\n        return object.map(function (item) {\n            return getClone(item, SingulumStore);\n        });\n    }\n\n    if (isObject(object)) {\n        var _ret = function () {\n            var cloneObject = {};\n\n            forEachObject(object, function (value, key) {\n                cloneObject[key] = getClone(value, SingulumStore);\n            });\n\n            if (isInstanceOf(object, SingulumStore)) {\n                cloneObject = new SingulumStore(cloneObject);\n            }\n\n            return {\n                v: cloneObject\n            };\n        }();\n\n        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === \"object\") return _ret.v;\n    }\n\n    if (isDate(object)) {\n        return new Date(object.valueOf());\n    }\n\n    return object;\n};\n\n/**\n * Set property to be non-enumerable\n *\n * @param {Object} object\n * @param {string} property\n * @param {*} value\n */\nvar setHidden = exports.setHidden = function setHidden(object, property, value) {\n    Object.defineProperty(object, property, {\n        configurable: true,\n        enumerable: false,\n        value: value,\n        writable: true\n    });\n};\n\n/**\n * Set property on object as getter only, making it immutable\n *\n * @param {Object} object\n * @param {string} property\n * @param {*} value\n */\nvar setReadonly = exports.setReadonly = function setReadonly(object, property, value) {\n    Object.defineProperty(object, property, {\n        get: function get() {\n            return value;\n        },\n        set: function set() {\n            throwError('Cannot set a value for ' + property + ', as it is immutable.');\n        }\n    });\n};\n\n/**\n * Consolidated error throwing function, mainly for minification benefits\n *\n * @param {string} error\n */\nvar throwError = exports.throwError = function throwError(error) {\n    throw new Error(error);\n};\n\nexports.default = {\n    bindFunction: bindFunction,\n    forEachObject: forEachObject,\n    getClone: getClone,\n    isArray: isArray,\n    isFunction: isFunction,\n    isInstanceOf: isInstanceOf,\n    isObject: isObject,\n    isString: isString,\n    setHidden: setHidden,\n    setReadonly: setReadonly,\n    throwError: throwError\n};\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvdXRpbHMuanM/MmI0YyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBUT19TVFJJTkcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIEJpbmRzIGZ1bmN0aW9uIHRvIHRoaXNBcmdcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmdcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGJpbmRGdW5jdGlvbiA9IChmbiwgdGhpc0FyZykgPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBQcm92aWRlZCBhcyBmYXN0ZXIgYWx0ZXJuYXRpdmUgZm9yIG5hdGl2ZSAuZm9yRWFjaFxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5leHBvcnQgY29uc3QgZm9yRWFjaE9iamVjdCA9IChvYmplY3QsIGZuKSA9PiB7XG4gICAgY29uc3Qga2V5c0FycmF5ID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5c0FycmF5Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c0FycmF5W2luZGV4XTtcblxuICAgICAgICBmbihvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpO1xuICAgIH1cbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBvYmplY3QgaXMgb2YgdHlwZSBBcnJheVxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIFRPX1NUUklORy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgb2JqZWN0IGlzIG9mIHR5cGUgRGF0ZVxuICogTm90IGV4cG9ydGVkIGJlY2F1c2Ugbm90IHVzZWQgZWxzZXdoZXJlXG4gKlxuICogQHBhcmFtIHsqfSBvYmplY3RcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5jb25zdCBpc0RhdGUgPSAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIFRPX1NUUklORy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBvYmplY3QgaXMgb2YgdHlwZSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzRnVuY3Rpb24gPSAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIFRPX1NUUklORy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfHwgdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIG9iamVjdCBpcyBpbnN0YW5jZSBvZiBDb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvclxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc0luc3RhbmNlT2YgPSAob2JqZWN0LCBDb25zdHJ1Y3RvcikgPT4ge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBDb25zdHJ1Y3Rvcjtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBvYmplY3QgaXMgb2YgdHlwZSBPYmplY3RcbiAqXG4gKiBAcGFyYW0geyp9IG9iamVjdFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc09iamVjdCA9IChvYmplY3QpID0+IHtcbiAgICByZXR1cm4gVE9fU1RSSU5HLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgJiYgISFvYmplY3Q7XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgb2JqZWN0IGlzIG9mIHR5cGUgU3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSBvYmplY3RcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3QgaXNTdHJpbmcgPSAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIFRPX1NUUklORy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGNsb25lIG9mIFNpbmd1bHVtIG9iamVjdCB3aXRoIG1ldGFkYXRhIHN0cmlwcGVkIGFuZCBjaGlsZFxuICogc3RvcmVzIHdpdGggU2luZ3VsdW1TdG9yZSBjbGFzcyBhcHBsaWVkXG4gKlxuICogQHBhcmFtIHsqfSBvYmplY3RcbiAqIEBwYXJhbSB7U2luZ3VsdW1TdG9yZX0gU2luZ3VsdW1TdG9yZVxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDbG9uZSA9IChvYmplY3QsIFNpbmd1bHVtU3RvcmUpID0+IHtcbiAgICBpZiAoaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q2xvbmUoaXRlbSwgU2luZ3VsdW1TdG9yZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIGxldCBjbG9uZU9iamVjdCA9IHt9O1xuXG4gICAgICAgIGZvckVhY2hPYmplY3Qob2JqZWN0LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgY2xvbmVPYmplY3Rba2V5XSA9IGdldENsb25lKHZhbHVlLCBTaW5ndWx1bVN0b3JlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGlzSW5zdGFuY2VPZihvYmplY3QsIFNpbmd1bHVtU3RvcmUpKSB7XG4gICAgICAgICAgICBjbG9uZU9iamVjdCA9IG5ldyBTaW5ndWx1bVN0b3JlKGNsb25lT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbG9uZU9iamVjdDtcbiAgICB9XG5cbiAgICBpZiAoaXNEYXRlKG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG9iamVjdC52YWx1ZU9mKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuXG4vKipcbiAqIFNldCBwcm9wZXJ0eSB0byBiZSBub24tZW51bWVyYWJsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3Qgc2V0SGlkZGVuID0gKG9iamVjdCwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFNldCBwcm9wZXJ0eSBvbiBvYmplY3QgYXMgZ2V0dGVyIG9ubHksIG1ha2luZyBpdCBpbW11dGFibGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IHNldFJlYWRvbmx5ID0gKG9iamVjdCwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQoKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKGBDYW5ub3Qgc2V0IGEgdmFsdWUgZm9yICR7cHJvcGVydHl9LCBhcyBpdCBpcyBpbW11dGFibGUuYCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogQ29uc29saWRhdGVkIGVycm9yIHRocm93aW5nIGZ1bmN0aW9uLCBtYWlubHkgZm9yIG1pbmlmaWNhdGlvbiBiZW5lZml0c1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvclxuICovXG5leHBvcnQgY29uc3QgdGhyb3dFcnJvciA9IChlcnJvcikgPT4ge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgYmluZEZ1bmN0aW9uLFxuICAgIGZvckVhY2hPYmplY3QsXG4gICAgZ2V0Q2xvbmUsXG4gICAgaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uLFxuICAgIGlzSW5zdGFuY2VPZixcbiAgICBpc09iamVjdCxcbiAgICBpc1N0cmluZyxcbiAgICBzZXRIaWRkZW4sXG4gICAgc2V0UmVhZG9ubHksXG4gICAgdGhyb3dFcnJvclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBzcmMvdXRpbHMuanNcbiAqKi8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTs7Ozs7Ozs7QUFRQTtBQUNBO0FBQUE7O0FBQUE7QUFDQTtBQUFBO0FBREE7QUFEQTtBQUNBOzs7Ozs7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUhBO0FBQ0E7Ozs7Ozs7QUFlQTtBQUNBO0FBREE7QUFDQTs7Ozs7Ozs7QUFVQTtBQUNBO0FBREE7QUFDQTs7Ozs7OztBQVNBO0FBQ0E7QUFEQTtBQUNBOzs7Ozs7OztBQVVBO0FBQ0E7QUFEQTtBQUNBOzs7Ozs7O0FBU0E7QUFDQTtBQURBO0FBQ0E7Ozs7Ozs7QUFTQTtBQUNBO0FBREE7QUFDQTs7Ozs7Ozs7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBQ0E7QUFLQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQUE7QUFBQTtBQVhBO0FBQ0E7O0FBREE7QUFDQTtBQWFBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUF6QkE7QUFDQTs7Ozs7Ozs7QUFrQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFEQTtBQUNBOzs7Ozs7OztBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBTEE7QUFBQTtBQURBO0FBQ0E7Ozs7OztBQWVBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ])
});
;
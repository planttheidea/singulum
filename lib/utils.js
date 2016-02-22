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
var isArray = function isArray(object) {
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
    isFunction: isFunction,
    isInstanceOf: isInstanceOf,
    isObject: isObject,
    isString: isString,
    setHidden: setHidden,
    setReadonly: setReadonly,
    throwError: throwError
};
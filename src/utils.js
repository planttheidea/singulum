const TO_STRING = Object.prototype.toString;

/**
 * Binds function to thisArg
 *
 * @param {Function} fn
 * @param {Object} thisArg
 * @returns {Function}
 */
export const bindFunction = (fn, thisArg) => {
    return function(...args) {
        return fn.apply(thisArg, args);
    };
};

/**
 * Provided as faster alternative for native .forEach
 *
 * @param {Array} array
 * @param {Function} fn
 */
export const forEach = (array, fn) => {
    for (let index = 0, length = array.length; index < length; index++) {
        fn(array[index], index, array);
    }
};

/**
 * Determines if object is of type Array
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isArray = (object) => {
    return TO_STRING.call(object) === '[object Array]';
};

/**
 * Determines if object is of type Date
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isDate = (object) => {
    return TO_STRING.call(object) === '[object Date]';
};

/**
 * Determines if object is of type Function
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isFunction = (object) => {
    return TO_STRING.call(object) === '[object Function]' || typeof object === 'function';
};

/**
 * Determines if object is of type Object
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isObject = (object) => {
    return TO_STRING.call(object) === '[object Object]' && !!object;
};

/**
 * Determines if object is of type String
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isString = (object) => {
    return TO_STRING.call(object) === '[object String]';
};

/**
 * Determines if object is undefined
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isUndefined = (object) => {
    return object === void 0;
};

/**
 * Returns clone of Singulum object with metadata stripped and child
 * stores with SingulumStore class applied
 *
 * @param {*} object
 * @param {SingulumStore} SingulumStore
 * @returns {*}
 */
export const getClone = (object, SingulumStore) => {
    if (isArray(object)) {
        return object.map((item) => {
            return getClone(item, SingulumStore);
        });
    }

    if (isObject(object)) {
        let cloneObject = {};

        Object.keys(object).forEach((key) => {
            const value = object[key];

            cloneObject[key] = getClone(value, SingulumStore);
        });

        if (object instanceof SingulumStore) {
            cloneObject = new SingulumStore(cloneObject);
        }

        return cloneObject;
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
export const setHidden = (object, property, value) => {
    Object.defineProperty(object, property, {
        configurable: true,
        enumerable: false,
        value,
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
export const setReadonly = (object, property, value) => {
    Object.defineProperty(object, property, {
        get() {
            return value;
        },
        set() {
            throw new Error(`Cannot set a value for ${property}, as it is immutable.`);
        }
    });
};

export default {
    bindFunction,
    forEach,
    getClone,
    isArray,
    isDate,
    isFunction,
    isObject,
    isString,
    isUndefined,
    setHidden,
    setReadonly
};
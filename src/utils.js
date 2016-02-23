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

export const findIndex = (array, callback) => {
    for (let index = 0, length = array.length; index < length; index++) {
        if (callback(array[index], index, array)) {
            return index;
        }
    }
};

/**
 * Provided as faster alternative for native .forEach
 *
 * @param {Array} array
 * @param {Function} fn
 */
export const forEachObject = (object, fn) => {
    const keysArray = Object.keys(object);

    for (let index = 0, length = keysArray.length; index < length; index++) {
        const key = keysArray[index];

        fn(object[key], key, object);
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
 * Not exported because not used elsewhere
 *
 * @param {*} object
 * @returns {boolean}
 */
const isDate = (object) => {
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
 * Determine if object is instance of Constructor
 *
 * @param {*} object
 * @param {Function} Constructor
 * @returns {boolean}
 */
export const isInstanceOf = (object, Constructor) => {
    return object instanceof Constructor;
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

        forEachObject(object, (value, key) => {
            cloneObject[key] = getClone(value, SingulumStore);
        });

        if (isInstanceOf(object, SingulumStore)) {
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
            throwError(`Cannot set a value for ${property}, as it is immutable.`);
        }
    });
};

/**
 * Consolidated error throwing function, mainly for minification benefits
 *
 * @param {string} error
 */
export const throwError = (error) => {
    throw new Error(error);
};

export default {
    bindFunction,
    findIndex,
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
};
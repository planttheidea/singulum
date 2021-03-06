const DEFINE_PROPERTY = Object.defineProperty;
const GET_OWN_PROPERTY_NAMES = Object.getOwnPropertyNames;
const TO_STRING = Object.prototype.toString;

/**
 * Determines if object is of type Array
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isArray = (object) => TO_STRING.call(object) === '[object Array]';

/**
 * Determines if object is of type Object
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isObject = (object) => TO_STRING.call(object) === '[object Object]' && !!object;

/**
 * Determines if object is an instance of a class
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isClassInstance = (object) =>
  isObject(object) && Object.getPrototypeOf(object).constructor !== Object.prototype.constructor;

/**
 * Determines if object is of type Date
 * Not exported because not used elsewhere
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isDate = (object) => TO_STRING.call(object) === '[object Date]';

/**
 * Determines if object is of type Function
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isFunction = (object) => TO_STRING.call(object) === '[object Function]' || typeof object === 'function';

/**
 * Determine if object is instance of Constructor
 *
 * @param {*} object
 * @param {Function} Constructor
 * @returns {boolean}
 */
export const isInstanceOf = (object, Constructor) => object instanceof Constructor;

/**
 * Determines if we are in production or not, based on NODE_ENV
 *
 * @returns {boolean}
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Determines if object is of type String
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isString = (object) => TO_STRING.call(object) === '[object String]';

/**
 * Determines if object is undefined
 *
 * @param {*} object
 * @returns {boolean}
 */
export const isUndefined = (object) => object === void 0;

/**
 * Binds function to thisArg
 *
 * @param {Function} fn
 * @param {Object} thisArg
 * @returns {Function}
 */
export const bindFunction = (fn, thisArg) =>
  function(...args) {
    return fn.apply(thisArg, args);
  };

/**
 * Finds the index in the array where the callback returns a truthy value
 *
 * @param {Array} array
 * @param {Function} callback
 * @returns {number}
 */
export const findIndex = (array, callback) => {
  for (let index = 0, length = array.length; index < length; index++) {
    if (callback(array[index], index, array)) {
      return index;
    }
  }

  return -1;
};

/**
 * Provided as faster alternative for native .forEach
 *
 * @param {Object} object
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
 * Returns clone of Singulum object with metadata stripped and child
 * stores with SingulumStore class applied
 *
 * @param {*} object
 * @param {SingulumStore} SingulumStore
 * @returns {*}
 */
export const getClone = (object, SingulumStore) => {
  if (isArray(object)) {
    return object.map((item) => getClone(item, SingulumStore));
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

const setMutableProperty = (object, property, targetObject) => {
  const descriptor = Object.getOwnPropertyDescriptor(object, property) || {};

  let value = object[property];

  if (isArray(value) || isObject(value)) {
    // eslint-disable-next-line no-use-before-define
    value = getMutableObject(value);
  }

  DEFINE_PROPERTY(targetObject, property, {
    configurable: true,
    enumerable: descriptor.enumerable || true,
    value,
    writable: true,
  });
};

/**
 * Returns mutable version of object passed
 *
 * @param {*} object
 * @returns {*}
 */
export function getMutableObject(object) {
  const isObjectArray = isArray(object);

  if (!isObjectArray & !isObject(object)) {
    return object;
  }

  let mutableObject = isObjectArray ? [] : {};

  if (isObjectArray) {
    object.forEach((item, itemIndex) => {
      setMutableProperty(object, itemIndex, mutableObject);
    });
  } else {
    forEachObject(object, (value, property) => {
      setMutableProperty(object, property, mutableObject);
    });
  }

  return mutableObject;
}

/**
 * Serialize object into string value, to be used for hashing
 *
 * @param {*} object
 * @returns {string}
 */
export const serialize = (object, Singulum) => {
  if (isInstanceOf(object, Singulum)) {
    object = object.store;
  }

  const type = typeof object;

  let serializedCode = '';

  if (type === 'object') {
    for (let element in object) {
      serializedCode += `{${type}:${element}${serialize(object[element], Singulum)}}`;
    }
  } else if (type === 'function') {
    serializedCode += `{${type}:${object.toString()}}`;
  } else {
    serializedCode += `{${type}:${object}}`;
  }

  return serializedCode.replace(/\s/g, '');
};

/**
 * Build integer hashCode from object
 *
 * @param {*} object
 * @returns {number}
 */
export const hashCode = (object, Singulum) => {
  const serializedObject = serialize(object, Singulum);

  if (serializedObject === '') {
    return 0;
  }

  let hashCode = 0,
      char;

  for (let index = 0, length = serializedObject.length; index < length; index++) {
    char = serializedObject.charCodeAt(index);
    hashCode = (hashCode << 5) - hashCode + char;
    hashCode |= 0;
  }

  return hashCode;
};

/**
 * Determines if the two objects have equal values (checks deeply)
 *
 * @param {*} object1
 * @param {*} object2
 * @returns {*}
 */
export const isEqual = (object1, object2, Singulum) => hashCode(object1, Singulum) === hashCode(object2, Singulum);

/**
 * Set property to be non-enumerable
 *
 * @param {Object} object
 * @param {string} property
 * @param {*} value
 */
export const setHidden = (object, property, value) => {
  DEFINE_PROPERTY(object, property, {
    configurable: true,
    enumerable: false,
    value,
    writable: true,
  });
};

/**
 * Creates deeply-immutable version of object by only creating getters on clone
 *
 * @param {*} object
 * @param {string} property
 * @param {*} value
 * @param {object} descriptor
 * @returns {*}
 */
export const setImmutable = (object, property, value, descriptor = {}) => {
  let realValue;

  switch (true) {
    case isArray(value):
      realValue = [];

      value.forEach((valueItem, valueItemIndex) => {
        setImmutable(realValue, valueItemIndex, valueItem);
      });

      break;

    case isObject(value):
      realValue = {};

      GET_OWN_PROPERTY_NAMES(value).forEach((valueItemKey) => {
        setImmutable(realValue, valueItemKey, value[valueItemKey]);
      });

      break;

    case isDate(value):
      realValue = value.valueOf();
      break;

    case isFunction(value):
      realValue = function(...args) {
        return value.apply(this, args);
      };

      forEachObject(value, (item, key) => {
        if (value.hasOwnProperty(key)) {
          setImmutable(realValue, key, item);
        }
      });

      break;

    default:
      realValue = value;
      break;
  }

  DEFINE_PROPERTY(object, property, {
    configurable: false,
    enumerable: descriptor.enumerable || true,
    get() {
      return realValue;
    },
    set() {
      throw new SyntaxError(
        `You are trying to set a value on an immutable object which is not allowed. Check the assignment of property ${property}.`
      );
    },
  });

  return object[property];
};

/**
 * Consolidated error throwing function, mainly for minification benefits
 *
 * @param {string} error
 */
export const throwError = (error) => {
  throw new Error(error);
};

/**
 * Set property on object as getter only, making it immutable
 *
 * @param {Object} object
 * @param {string} property
 * @param {*} value
 */
export const setReadonly = (object, property, value) => {
  DEFINE_PROPERTY(object, property, {
    get() {
      return value;
    },
    set() {
      throwError(`Cannot set a value for ${property}, as it is immutable.`);
    },
  });
};

export default {
  bindFunction,
  findIndex,
  forEachObject,
  getClone,
  getMutableObject,
  hashCode,
  isArray,
  isClassInstance,
  isDate,
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
  throwError,
};

import singulum from '../../src';
import axios from 'axios';

/**
 * Convenience method for returning the data object pulled from response
 *
 * @param {Object} response
 * @returns {*}
 */
const getData = (response) => {
  return response.data;
};

/**
 * Gets all data and returns object that will populate author, description, and name on the state object
 * description is not initially declared on the state, but because it is returned it is added to it
 *
 * @returns {Promise}
 */
const getAllData = () => {
  return axios
    .get ('/api', {
      params: {
        author: 'Tony Quetano',
        description: 'State management sanity with minimal effort',
        name: 'Singulum (overwritten by getAllData)'
      }
    })
    .then (getData)
    .then ((data) => {
      branch.actions.setLoading({
        author: false,
        description: false,
        name: false
      });

      return {
        ...branch.store,
        ...data
      };
    });
};

/**
 * Gets name only
 *
 * @returns {Promise}
 */
const getName = () => {
  return axios
    .get ('/api', {
      params: {
        name: 'Singulum'
      }
    })
    .then (getData)
    .then ((data) => {
      branch.actions.setLoading({
        name: false
      });

      return data.name;
    });
};

/**
 * Gets version only
 *
 * @returns {Promise}
 */
const getVersion = () => {
  return axios
    .get ('/api', {
      params: {
        name: 'Singulum',
        version: '0.3.0'
      }
    })
    .then (getData)
    .then ((data) => {
      branch.actions.setLoading({
        version: false
      });

      return data.version;
    });
};

/**
 * Sets loading object based on merging newLoadingObject with currentLoadingObject
 *
 * @param {Object} loading
 * @param {Object} objectToMerge
 * @returns {Object}
 */
const setLoading = (loading, objectToMerge) => {
  return {
    ...loading,
    ...objectToMerge
  };
};

/**
 * Set actions, where top-level functions update all state, and mapped functions update the key they map to
 */
const actions = {
  getAllData,
  loading: {
    setLoading
  },
  name: {
    getName
  },
  version: {
    getVersion
  }
};

/**
 * initial values of state
 */
const initialValues = {
  author: '',
  loading: {
    author: true,
    name: true,
    version: true
  },
  name: '',
  version: ''
};

/**
 * Declaration of the asyncBranch, notice that getAllData is not parameter-specific, meaning every key
 * in the object that it returns will update a value on the state, rather than being dedicated to a specific
 * property
 */
const branch = singulum.branch (actions, initialValues, 'asyncBranch');

export default branch;
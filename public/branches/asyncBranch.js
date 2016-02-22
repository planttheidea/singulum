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
        .get('/api', {
            params: {
                author: 'Tony Quetano',
                description: 'State management sanity with minimal effort',
                name: 'Singulum (overwritten by getAllData)'
            }
        })
        .then(getData);
};

/**
 * Gets name only
 *
 * @returns {Promise}
 */
const getName = () => {
    return axios
        .get('/api', {
            params: {
                name: 'Singulum'
            }
        })
        .then(getData)
        .then((data) => {
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
        .get('/api', {
            params: {
                name: 'Singulum',
                version: '0.3.0'
            }
        })
        .then(getData)
        .then((data) => {
            return data.version;
        });
};

/**
 * Sets loading object based on merging newLoadingObject with currentLoadingObject
 *
 * @param {Object} currentLoadingObject
 * @param {Object} newLoadingObject
 * @returns {Object}
 */
const setLoading = (currentLoadingObject, newLoadingObject) => {
    return {
        ...currentLoadingObject,
        ...newLoadingObject
    };
};

/**
 * Declaration of the asyncBranch, notice that getAllData is not parameter-specific, meaning every key
 * in the object that it returns will update a value on the state, rather than being dedicated to a specific
 * property
 */
export default singulum.branch('asyncBranch', {
    author: {
        initialValue: ''
    },
    getAllData,
    loading: {
        setLoading,
        initialValue: {
            author: true,
            name: true,
            version: true
        }
    },
    name: {
        getName,
        initialValue: ''
    },
    version: {
        getVersion,
        initialValue: ''
    }
});
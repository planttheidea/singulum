import axios from 'axios';

const setAjaxDefaults = ({baseURL, headers} = {}, axiosInstance = axios) => {
  if (baseURL) {
    axiosInstance.defaults.baseURL = baseURL;
  }

  if (headers) {
    const {
      del,
      get,
      head,
      patch,
      post,
      put,
      ...common
    } = headers;

    axiosInstance.defaults.headers.delete = del;
    axiosInstance.defaults.headers.get = get;
    axiosInstance.defaults.headers.head = head;
    axiosInstance.defaults.headers.patch = patch;
    axiosInstance.defaults.headers.post = post;
    axiosInstance.defaults.headers.put = put;

    Object.keys(common).forEach((key) => {
      axiosInstance.defaults.headers.common[key] = common[key];
    });
  }

  return axiosInstance;
};

const del = axios.delete;
const get = axios.get;
const head = axios.head;
const patch = axios.patch;
const post = axios.post;
const put = axios.put;

export {del};
export {get};
export {head};
export {patch};
export {post};
export {put};

export {setAjaxDefaults};

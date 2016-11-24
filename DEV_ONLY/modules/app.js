import {
  createModule,
  get,
  getActionConstants
} from '../../src';

const module = createModule('app');

const DECREASE_COUNTER = 'DECREASE_COUNTER';
const GET_STUFF_REQUEST = 'GET_STUFF_REQUEST';
const GET_STUFF_ERROR = 'GET_STUFF_ERROR';
const GET_STUFF_SUCCESS = 'GET_STUFF_SUCCESS';
const INCREASE_COUNTER = 'INCREASE_COUNTER';
const SET_CHECK = 'SET_CHECK';
const SET_COUNTER = 'SET_COUNTER';

const decreaseCounter = module.createAction(DECREASE_COUNTER, (currentCount) => {
  return currentCount - 1;
});

const getStuff = module.createAsyncAction('GET_STUFF', ({
  onError,
  onRequest,
  onSuccess
}) => {
  return (dispatch) => {
    dispatch(onRequest());

    get('https://httpbin.org/get')
      .then(({data}) => {
        dispatch(onSuccess(data));
      })
      .catch((exception) => {
        dispatch(onError(exception));
      });
  };
});

const increaseCounter = module.createAction(INCREASE_COUNTER, (currentCount) => {
  return currentCount + 1;
});

const setCount = module.createAction(SET_COUNTER, (count) => {
  return count;
});

const setIsChecked = module.createAction(SET_CHECK, (isChecked) => {
  return isChecked;
});

const getStuffHandler = (state, {payload}) => {
  if (!payload) {
    return {
      ...state,
      stuff: 'Getting the stuff'
    };
  }

  if (payload instanceof Error) {
    return {
      ...state,
      stuff: 'Problem getting the stuff'
    };
  }

  return {
    ...state,
    stuff: 'Got the stuff'
  };
};

const updateCounter = (state, {payload}) => {
  return {
    ...state,
    count: payload
  };
};

const INITIAL_STATE = {
  count: 0,
  isChecked: false,
  stuff: null
};

module.createReducer(INITIAL_STATE, {
  [decreaseCounter]: updateCounter,
  [increaseCounter]: updateCounter,

  [getStuff.onRequest]: getStuffHandler,
  [getStuff.onError]: getStuffHandler,
  [getStuff.onSuccess]: getStuffHandler,

  [setCount](state, {payload}) {
    return {
      ...state,
      count: payload
    };
  },

  [setIsChecked](state, {payload}) {
    return {
      ...state,
      isChecked: payload
    };
  }
});

// const ACTION_TYPES = getActionConstants('app');
//
// module.createReducer(INITIAL_STATE, (state, action) => {
//   switch (action.type) {
//     case ACTION_TYPES.DECREASE_COUNTER:
//     case ACTION_TYPES.INCREASE_COUNTER:
//       return updateCounter(state, action);
//
//     case ACTION_TYPES.SET_CHECK:
//       return {
//         ...state,
//         isChecked: action.payload
//       };
//
//     default:
//       return state;
//   }
// });

export {decreaseCounter};
export {getStuff};
export {increaseCounter};
export {setIsChecked};
export {setCount};

export default module;

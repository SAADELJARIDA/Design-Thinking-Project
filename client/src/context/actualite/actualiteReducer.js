import {
  GET_ACTUALITES,
  GET_ACTUALITE,
  GET_LATEST_ACTUALITES,
  ADD_ACTUALITE,
  DELETE_ACTUALITE,
  UPDATE_ACTUALITE,
  ACTUALITE_ERROR,
  SET_LOADING,
  SET_CURRENT,
  CLEAR_CURRENT
} from '../types';

const actualiteReducer = (state, action) => {
  switch (action.type) {
    case GET_ACTUALITES:
      return {
        ...state,
        actualites: action.payload,
        loading: false
      };
    case GET_LATEST_ACTUALITES:
      return {
        ...state,
        latestActualites: action.payload,
        loading: false
      };
    case GET_ACTUALITE:
      return {
        ...state,
        actualite: action.payload,
        loading: false
      };
    case ADD_ACTUALITE:
      return {
        ...state,
        actualites: [action.payload, ...state.actualites],
        loading: false
      };
    case UPDATE_ACTUALITE:
      return {
        ...state,
        actualites: state.actualites.map(actualite =>
          actualite._id === action.payload._id ? action.payload : actualite
        ),
        loading: false
      };
    case DELETE_ACTUALITE:
      return {
        ...state,
        actualites: state.actualites.filter(
          actualite => actualite._id !== action.payload
        ),
        loading: false
      };
    case ACTUALITE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export default actualiteReducer; 
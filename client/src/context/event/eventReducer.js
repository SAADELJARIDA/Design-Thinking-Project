import {
  GET_EVENTS,
  GET_EVENT,
  GET_UPCOMING_EVENTS,
  ADD_EVENT,
  DELETE_EVENT,
  UPDATE_EVENT,
  EVENT_ERROR,
  SET_LOADING,
  SET_CURRENT,
  CLEAR_CURRENT
} from '../types';

const eventReducer = (state, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.payload,
        loading: false
      };
    case GET_UPCOMING_EVENTS:
      return {
        ...state,
        upcomingEvents: action.payload,
        loading: false
      };
    case GET_EVENT:
      return {
        ...state,
        event: action.payload,
        loading: false
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [action.payload, ...state.events],
        loading: false
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event._id === action.payload._id ? action.payload : event
        ),
        loading: false
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(
          event => event._id !== action.payload
        ),
        loading: false
      };
    case EVENT_ERROR:
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

export default eventReducer; 
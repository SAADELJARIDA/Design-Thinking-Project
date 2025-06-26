import {
  GET_COMMENTS,
  ADD_COMMENT,
  DELETE_COMMENT,
  COMMENT_ERROR,
  CLEAR_COMMENTS
} from '../types';

const commentReducer = (state, action) => {
  switch (action.type) {
    case GET_COMMENTS:
      return {
        ...state,
        comments: action.payload,
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
        loading: false
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment._id !== action.payload
        ),
        loading: false
      };
    case COMMENT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
        loading: false
      };
    default:
      return state;
  }
};

export default commentReducer; 
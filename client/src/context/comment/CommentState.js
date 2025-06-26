import React, { useReducer } from 'react';
import axios from 'axios';
import CommentContext from './commentContext';
import commentReducer from './commentReducer';
import {
  GET_COMMENTS,
  ADD_COMMENT,
  DELETE_COMMENT,
  COMMENT_ERROR,
  CLEAR_COMMENTS
} from '../types';

const CommentState = props => {
  const initialState = {
    comments: [],
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(commentReducer, initialState);

  // Get comments for a post
  const getComments = async (postId) => {
    try {
      const res = await axios.get(`/api/comments/${postId}`);
      
      dispatch({
        type: GET_COMMENTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: COMMENT_ERROR,
        payload: err.response?.data?.msg || 'Error fetching comments'
      });
    }
  };

  // Add comment
  const addComment = async (postId, commentData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/comments/${postId}`, commentData, config);
      
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: COMMENT_ERROR,
        payload: err.response?.data?.msg || 'Error adding comment'
      });
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      
      dispatch({
        type: DELETE_COMMENT,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: COMMENT_ERROR,
        payload: err.response?.data?.msg || 'Error deleting comment'
      });
    }
  };

  // Clear comments
  const clearComments = () => {
    dispatch({ type: CLEAR_COMMENTS });
  };

  return (
    <CommentContext.Provider
      value={{
        comments: state.comments,
        loading: state.loading,
        error: state.error,
        getComments,
        addComment,
        deleteComment,
        clearComments
      }}
    >
      {props.children}
    </CommentContext.Provider>
  );
};

export default CommentState; 
import React, { useReducer } from 'react';
import axios from 'axios';
import PostContext from './postContext';
import postReducer from './postReducer';
import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  DELETE_POST,
  UPDATE_POST,
  POST_ERROR,
  SET_LOADING,
  SET_CURRENT,
  CLEAR_CURRENT,
  LIKE_POST,
  UNLIKE_POST
} from '../types';

const PostState = props => {
  const initialState = {
    posts: [],
    current: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(postReducer, initialState);

  // Get all posts
  const getPosts = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/api/posts');
      dispatch({ type: GET_POSTS, payload: res.data });
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: err.response.data.msg });
    }
  };

  // Get a single post
  const getPost = async id => {
    setLoading();
    
    try {
      const res = await axios.get(`/api/posts/${id}`);
      dispatch({ type: GET_POST, payload: res.data });
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: err.response.data.msg });
    }
  };

  // Add post
  const addPost = async post => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/posts', post, config);
      dispatch({ type: ADD_POST, payload: res.data });
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: err.response.data.msg });
    }
  };

  // Update post
  const updatePost = async post => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/posts/${post._id}`, post, config);
      dispatch({ type: UPDATE_POST, payload: res.data });
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: err.response.data.msg });
    }
  };

  // Delete post
  const deletePost = async id => {
    try {
      await axios.delete(`/api/posts/${id}`);
      dispatch({ type: DELETE_POST, payload: id });
    } catch (err) {
      dispatch({ type: POST_ERROR, payload: err.response.data.msg });
    }
  };

  // Like post
  const likePost = async id => {
    try {
      const res = await axios.put(`/api/posts/like/${id}`);
      
      dispatch({
        type: LIKE_POST,
        payload: { id, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Unlike post
  const unlikePost = async id => {
    try {
      const res = await axios.put(`/api/posts/unlike/${id}`);
      
      dispatch({
        type: UNLIKE_POST,
        payload: { id, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  // Set current post
  const setCurrent = post => {
    dispatch({ type: SET_CURRENT, payload: post });
  };

  // Clear current post
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Set loading
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  return (
    <PostContext.Provider
      value={{
        posts: state.posts,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getPosts,
        getPost,
        addPost,
        updatePost,
        deletePost,
        setCurrent,
        clearCurrent,
        likePost,
        unlikePost
      }}
    >
      {props.children}
    </PostContext.Provider>
  );
};

export default PostState;
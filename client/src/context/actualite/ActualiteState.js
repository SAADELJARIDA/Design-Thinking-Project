import React, { useReducer } from 'react';
import axios from 'axios';
import ActualiteContext from './actualiteContext';
import actualiteReducer from './actualiteReducer';
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

const ActualiteState = props => {
  const initialState = {
    actualites: [],
    latestActualites: [],
    actualite: null,
    current: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(actualiteReducer, initialState);

  // Get all actualites
  const getActualites = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/api/actualites');
      dispatch({ type: GET_ACTUALITES, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error fetching actualites' });
    }
  };

  // Get actualites by category
  const getActualitesByCategory = async (category) => {
    setLoading();
    
    try {
      const res = await axios.get(`/api/actualites/category/${category}`);
      dispatch({ type: GET_ACTUALITES, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error fetching actualites by category' });
    }
  };

  // Get latest actualites (limit 3)
  const getLatestActualites = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/api/actualites/latest');
      dispatch({ type: GET_LATEST_ACTUALITES, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error fetching latest actualites' });
    }
  };

  // Get a single actualite
  const getActualite = async id => {
    setLoading();
    
    try {
      const res = await axios.get(`/api/actualites/${id}`);
      dispatch({ type: GET_ACTUALITE, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error fetching actualite' });
    }
  };

  // Add actualite
  const addActualite = async actualite => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/actualites', actualite, config);
      dispatch({ type: ADD_ACTUALITE, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error adding actualite' });
    }
  };

  // Update actualite
  const updateActualite = async actualite => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/actualites/${actualite._id}`, actualite, config);
      dispatch({ type: UPDATE_ACTUALITE, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error updating actualite' });
    }
  };

  // Delete actualite
  const deleteActualite = async id => {
    try {
      await axios.delete(`/api/actualites/${id}`);
      dispatch({ type: DELETE_ACTUALITE, payload: id });
    } catch (err) {
      dispatch({ type: ACTUALITE_ERROR, payload: err.response?.data?.msg || 'Error deleting actualite' });
    }
  };

  // Set current actualite
  const setCurrent = actualite => {
    dispatch({ type: SET_CURRENT, payload: actualite });
  };

  // Clear current actualite
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Set loading
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  return (
    <ActualiteContext.Provider
      value={{
        actualites: state.actualites,
        latestActualites: state.latestActualites,
        actualite: state.actualite,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getActualites,
        getLatestActualites,
        getActualitesByCategory,
        getActualite,
        addActualite,
        updateActualite,
        deleteActualite,
        setCurrent,
        clearCurrent
      }}
    >
      {props.children}
    </ActualiteContext.Provider>
  );
};

export default ActualiteState; 
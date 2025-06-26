import React, { useReducer } from 'react';
import axios from 'axios';
import EventContext from './eventContext';
import eventReducer from './eventReducer';
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

const EventState = props => {
  const initialState = {
    events: [],
    upcomingEvents: [],
    event: null,
    current: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Get all events
  const getEvents = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/api/events');
      dispatch({ type: GET_EVENTS, payload: res.data });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error fetching events' });
    }
  };

  // Get events by category
  const getEventsByCategory = async (category) => {
    setLoading();
    
    try {
      const res = await axios.get(`/api/events/category/${category}`);
      dispatch({ type: GET_EVENTS, payload: res.data });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error fetching events by category' });
    }
  };

  // Get upcoming events
  const getUpcomingEvents = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/api/events/upcoming');
      dispatch({ type: GET_UPCOMING_EVENTS, payload: res.data });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error fetching upcoming events' });
    }
  };

  // Get a single event
  const getEvent = async id => {
    setLoading();
    
    try {
      const res = await axios.get(`/api/events/${id}`);
      dispatch({ type: GET_EVENT, payload: res.data });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error fetching event' });
    }
  };

  // Add event
  const addEvent = async event => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/events', event, config);
      dispatch({ type: ADD_EVENT, payload: res.data });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error adding event' });
    }
  };

  // Update event
  const updateEvent = async event => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/events/${event._id}`, event, config);
      dispatch({ type: UPDATE_EVENT, payload: res.data });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error updating event' });
    }
  };

  // Delete event
  const deleteEvent = async id => {
    try {
      await axios.delete(`/api/events/${id}`);
      dispatch({ type: DELETE_EVENT, payload: id });
    } catch (err) {
      dispatch({ type: EVENT_ERROR, payload: err.response?.data?.msg || 'Error deleting event' });
    }
  };

  // Set current event
  const setCurrent = event => {
    dispatch({ type: SET_CURRENT, payload: event });
  };

  // Clear current event
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Set loading
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  return (
    <EventContext.Provider
      value={{
        events: state.events,
        upcomingEvents: state.upcomingEvents,
        event: state.event,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getEvents,
        getUpcomingEvents,
        getEventsByCategory,
        getEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        setCurrent,
        clearCurrent
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
};

export default EventState; 
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventContext from '../../context/event/eventContext';
import EventItem from './EventItem';
import Spinner from '../layout/Spinner';

const UpcomingEvents = () => {
  const eventContext = useContext(EventContext);
  const { upcomingEvents, loading, getUpcomingEvents } = eventContext;
  
  useEffect(() => {
    getUpcomingEvents();
    // eslint-disable-next-line
  }, []);
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Événements à venir</h2>
        <Link 
          to="/evenements" 
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          Voir tous les événements
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {upcomingEvents.length === 0 ? (
        <p className="text-center text-gray-600">Aucun événement à venir pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <EventItem key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents; 
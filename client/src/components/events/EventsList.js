import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventContext from '../../context/event/eventContext';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import EventItem from './EventItem';
import Spinner from '../layout/Spinner';

const EventsList = ({ admin }) => {
  const eventContext = useContext(EventContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  const { events, loading, getEvents, getEventsByCategory, deleteEvent, setCurrent } = eventContext;
  const { user } = authContext;
  const { setAlert } = alertContext;
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);
  
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      deleteEvent(id);
      setAlert('Événement supprimé', 'success');
    }
  };
  
  const handleEdit = (event) => {
    setCurrent(event);
    navigate(`/admin/evenements/edit/${event._id}`);
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      getEvents();
    } else {
      getEventsByCategory(category);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  // Check for past and upcoming events
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.eventDate) >= now);
  const pastEvents = events.filter(event => new Date(event.eventDate) < now);
  
  // Sort upcoming events by date (closest first)
  upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  
  // Sort past events by date (most recent first)
  pastEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  
  // Combine arrays with upcoming first
  const sortedEvents = [...upcomingEvents, ...pastEvents];
  
  const categories = [
    { id: 'all', name: 'Tous les événements' },
    { id: 'académique', name: 'Académique' },
    { id: 'culturel', name: 'Culturel' },
    { id: 'sportif', name: 'Sportif' }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {admin ? 'Gestion des Événements' : 'Tous les Événements'}
        </h1>
        
        {admin && (
          <Link
            to="/admin/evenements/add"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvel Événement
          </Link>
        )}
      </div>
      
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Catégories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`mr-8 py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
                activeCategory === category.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeCategory === category.id ? 'page' : undefined}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
      
      {events.length === 0 ? (
        <p className="text-center text-gray-600">Aucun événement disponible pour le moment.</p>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Événements à venir</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map(event => (
                  <EventItem 
                    key={event._id} 
                    event={event}
                    admin={admin}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          )}
          
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Événements passés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map(event => (
                  <EventItem 
                    key={event._id} 
                    event={event}
                    admin={admin}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsList; 
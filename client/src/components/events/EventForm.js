import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import EventContext from '../../context/event/eventContext';
import AlertContext from '../../context/alert/alertContext';

const EventForm = () => {
  const eventContext = useContext(EventContext);
  const alertContext = useContext(AlertContext);
  
  const { addEvent, updateEvent, current, clearCurrent, getEvent } = eventContext;
  const { setAlert } = alertContext;
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Format date for datetime-local input
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 16);
  };
  
  const [event, setEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    imageUrl: '',
    category: 'académique'
  });
  
  useEffect(() => {
    // If editing an existing item
    if (id) {
      if (!current || (current && current._id !== id)) {
        getEvent(id);
      } else {
        setEvent({
          title: current.title,
          description: current.description,
          eventDate: formatDateForInput(current.eventDate),
          location: current.location,
          imageUrl: current.imageUrl || '',
          category: current.category || 'académique'
        });
      }
    } else {
      clearCurrent();
    }
    
    return () => {
      clearCurrent();
    };
    // eslint-disable-next-line
  }, [id, current]);
  
  const { title, description, eventDate, location, imageUrl, category } = event;
  
  const onChange = e => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    if (title.trim() === '' || description.trim() === '' || !eventDate || location.trim() === '') {
      setAlert('Merci de remplir tous les champs obligatoires', 'danger');
      return;
    }
    
    if (id) {
      // Update existing event
      updateEvent({
        _id: id,
        ...event
      });
      setAlert('Événement mis à jour', 'success');
    } else {
      // Add new event
      addEvent(event);
      setAlert('Événement ajouté', 'success');
    }
    
    // Redirect to admin events list
    navigate('/admin/evenements');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Link 
        to="/admin/evenements" 
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? 'Modifier un événement' : 'Ajouter un événement'}
        </h1>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-gray-700 font-medium mb-2"
            >
              Titre *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="category" 
              className="block text-gray-700 font-medium mb-2"
            >
              Catégorie *
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="académique">Académique</option>
              <option value="culturel">Culturel</option>
              <option value="sportif">Sportif</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="eventDate" 
              className="block text-gray-700 font-medium mb-2"
            >
              Date et heure *
            </label>
            <input
              type="datetime-local"
              name="eventDate"
              id="eventDate"
              value={eventDate}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="location" 
              className="block text-gray-700 font-medium mb-2"
            >
              Lieu *
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={location}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="description" 
              className="block text-gray-700 font-medium mb-2"
            >
              Description *
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={onChange}
              rows="10"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="imageUrl" 
              className="block text-gray-700 font-medium mb-2"
            >
              URL de l'image
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              value={imageUrl}
              onChange={onChange}
              placeholder="/images/event-default.jpg"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Laissez vide pour utiliser l'image par défaut
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {id ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 
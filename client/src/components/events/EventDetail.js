import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventContext from '../../context/event/eventContext';
import AuthContext from '../../context/auth/authContext';
import Spinner from '../layout/Spinner';
import { formatDate, formatTime, calculateCountdown } from '../../utils/formatDateTime';

const EventDetail = () => {
  const eventContext = useContext(EventContext);
  const authContext = useContext(AuthContext);
  
  const { event, loading, getEvent } = eventContext;
  const { user } = authContext;
  
  const { id } = useParams();
  
  // State for countdown
  const [countdown, setCountdown] = useState(null);
  const [isUpcoming, setIsUpcoming] = useState(false);
  
  useEffect(() => {
    getEvent(id);
    // eslint-disable-next-line
  }, [id]);
  
  useEffect(() => {
    if (event) {
      const initialCountdown = calculateCountdown(event.eventDate);
      setCountdown(initialCountdown);
      setIsUpcoming(initialCountdown !== null);
      
      if (initialCountdown) {
        const timer = setInterval(() => {
          const newCountdown = calculateCountdown(event.eventDate);
          if (newCountdown) {
            setCountdown(newCountdown);
          } else {
            setIsUpcoming(false);
            clearInterval(timer);
          }
        }, 60000); // update every minute
        
        return () => clearInterval(timer);
      }
    }
  }, [event]);
  
  if (loading || event === null) {
    return <Spinner />;
  }
  
  const { title, description, eventDate, location, imageUrl, author, category } = event;
  const formattedDate = formatDate(eventDate);
  const formattedTime = formatTime(eventDate);
  const isAdmin = user && user.role === 'admin';
  
  // Get category color
  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'académique':
        return 'bg-blue-100 text-blue-800';
      case 'culturel':
        return 'bg-purple-100 text-purple-800';
      case 'sportif':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/evenements" 
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux événements
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 sm:h-80 bg-gray-200 relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          
          {isUpcoming && countdown && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
              {countdown.days > 0 ? (
                <div className="text-center">
                  <div className="text-xl font-bold">{countdown.days}</div>
                  <div className="text-xs">jour{countdown.days > 1 ? 's' : ''}</div>
                </div>
              ) : countdown.hours > 0 ? (
                <div className="text-center">
                  <div className="text-xl font-bold">{countdown.hours}h {countdown.minutes}m</div>
                  <div className="text-xs">restant</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl font-bold">{countdown.minutes}m</div>
                  <div className="text-xs">restant</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
            
            {isAdmin && (
              <Link
                to={`/admin/evenements/edit/${id}`}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </Link>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-col sm:flex-row sm:divide-x divide-gray-300">
            <div className="flex items-center mb-3 sm:mb-0 sm:pr-4">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">{formattedDate}</span>
            </div>
            
            <div className="flex items-center mb-3 sm:mb-0 sm:px-4">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">{formattedTime}</span>
            </div>
            
            <div className="flex items-center sm:pl-4">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">{location}</span>
            </div>
          </div>
          
          {author && (
            <p className="text-gray-600 mb-6">
              Organisé par {author.name}
            </p>
          )}
          
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-line">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDate, formatTime, calculateCountdown } from '../../utils/formatDateTime';

const EventItem = ({ event, admin, onDelete, onEdit }) => {
  const { _id, title, description, eventDate, location, imageUrl, category } = event;
  
  // State for countdown
  const [countdown, setCountdown] = useState(calculateCountdown(eventDate));
  const [isUpcoming, setIsUpcoming] = useState(true);
  
  // Truncate description for card display
  const truncatedDescription = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;
  
  // Format date and time
  const formattedDate = formatDate(eventDate);
  const formattedTime = formatTime(eventDate);
  
  // Update countdown every minute
  useEffect(() => {
    // Check if event is in the past
    if (!calculateCountdown(eventDate)) {
      setIsUpcoming(false);
      return;
    }
    
    const timer = setInterval(() => {
      const newCountdown = calculateCountdown(eventDate);
      if (newCountdown) {
        setCountdown(newCountdown);
      } else {
        setIsUpcoming(false);
        clearInterval(timer);
      }
    }, 60000); // update every minute
    
    return () => clearInterval(timer);
  }, [eventDate]);
  
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {isUpcoming && countdown && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-medium">
            {countdown.days > 0 ? (
              <span>Dans {countdown.days}j {countdown.hours}h</span>
            ) : countdown.hours > 0 ? (
              <span>Dans {countdown.hours}h {countdown.minutes}m</span>
            ) : (
              <span>Dans {countdown.minutes}m</span>
            )}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-primary-600 font-medium">{formattedDate}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        
        <div className="flex items-center space-x-2 mb-2 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{formattedTime}</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{location}</span>
        </div>
        
        <p className="text-gray-600 mb-4">
          {truncatedDescription}
        </p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/evenements/${_id}`} 
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Plus de détails
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {admin && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(_id)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  admin: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

EventItem.defaultProps = {
  admin: false
};

export default EventItem; 
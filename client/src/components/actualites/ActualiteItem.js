import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/formatDate';

const ActualiteItem = ({ actualite, admin, onDelete, onEdit }) => {
  const { _id, title, content, date, imageUrl, category } = actualite;
  
  // Truncate content for card display
  const truncatedContent = content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content;
  
  // Format date from ISO to a readable format (e.g., "12 Mars 2024")
  const formattedDate = formatDate(date);
  
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
      <div className="h-48 bg-gray-200">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-primary-600 font-medium">{formattedDate}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">
          {truncatedContent}
        </p>
        <div className="flex justify-between items-center">
          <Link 
            to={`/actualites/${_id}`} 
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Lire la suite
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {admin && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(actualite)}
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

ActualiteItem.propTypes = {
  actualite: PropTypes.object.isRequired,
  admin: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

ActualiteItem.defaultProps = {
  admin: false
};

export default ActualiteItem; 
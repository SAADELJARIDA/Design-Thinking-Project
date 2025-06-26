import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActualiteContext from '../../context/actualite/actualiteContext';
import AuthContext from '../../context/auth/authContext';
import Spinner from '../layout/Spinner';
import { formatDate } from '../../utils/formatDate';

const ActualiteDetail = () => {
  const actualiteContext = useContext(ActualiteContext);
  const authContext = useContext(AuthContext);
  
  const { actualite, loading, getActualite } = actualiteContext;
  const { user } = authContext;
  
  const { id } = useParams();
  
  useEffect(() => {
    getActualite(id);
    // eslint-disable-next-line
  }, [id]);
  
  if (loading || actualite === null) {
    return <Spinner />;
  }
  
  const { title, content, date, imageUrl, author, category } = actualite;
  const formattedDate = formatDate(date);
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
        to="/actualites" 
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux actualités
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 sm:h-80 bg-gray-200">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-primary-600 font-medium">{formattedDate}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
            
            {isAdmin && (
              <Link
                to={`/admin/actualites/edit/${id}`}
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
          
          {author && (
            <p className="text-gray-600 mb-6">
              Par {author.name}
            </p>
          )}
          
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-line">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActualiteDetail; 
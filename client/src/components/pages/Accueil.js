import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActualiteContext from '../../context/actualite/actualiteContext';
import Spinner from '../layout/Spinner';
import { formatDate } from '../../utils/formatDate';
import UpcomingEvents from '../events/UpcomingEvents';

const Accueil = () => {
  const actualiteContext = useContext(ActualiteContext);
  const { latestActualites, loading, getLatestActualites } = actualiteContext;
  
  useEffect(() => {
    getLatestActualites();
    // eslint-disable-next-line
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/hero-banner.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-6xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Bienvenue à l'ENSA</h1>
              <p className="text-xl md:text-2xl mb-8">Découvrez l'excellence académique et l'innovation technologique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/evenements" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Événements</h3>
              <p className="text-gray-600">Découvrez les événements à venir et passés de l'école</p>
            </Link>
            <Link to="/actualites" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Actualités</h3>
              <p className="text-gray-600">Restez informé des dernières nouvelles de l'école</p>
            </Link>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dernières Actualités</h2>
          <Link 
            to="/actualites" 
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Voir toutes les actualités
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : latestActualites.length === 0 ? (
          <p className="text-center text-gray-600">Aucune actualité disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestActualites.map((actualite) => (
              <div key={actualite._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={actualite.imageUrl} 
                    alt={actualite.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm text-primary-600 font-medium">
                    {formatDate(actualite.date)}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{actualite.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {actualite.content.length > 100 
                      ? actualite.content.substring(0, 100) + '...' 
                      : actualite.content}
                  </p>
                  <Link 
                    to={`/actualites/${actualite._id}`} 
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  >
                    Lire la suite
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events Section */}
      <UpcomingEvents />
    </div>
  );
};

export default Accueil; 
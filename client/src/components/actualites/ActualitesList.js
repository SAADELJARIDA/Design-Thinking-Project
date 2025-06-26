import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActualiteContext from '../../context/actualite/actualiteContext';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import ActualiteItem from './ActualiteItem';
import Spinner from '../layout/Spinner';

const ActualitesList = ({ admin }) => {
  const actualiteContext = useContext(ActualiteContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  const { actualites, loading, getActualites, getActualitesByCategory, deleteActualite, setCurrent } = actualiteContext;
  const { user } = authContext;
  const { setAlert } = alertContext;
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    getActualites();
    // eslint-disable-next-line
  }, []);
  
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité?')) {
      deleteActualite(id);
      setAlert('Actualité supprimée', 'success');
    }
  };
  
  const handleEdit = (actualite) => {
    setCurrent(actualite);
    navigate(`/admin/actualites/edit/${actualite._id}`);
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      getActualites();
    } else {
      getActualitesByCategory(category);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  const categories = [
    { id: 'all', name: 'Toutes les actualités' },
    { id: 'académique', name: 'Académique' },
    { id: 'culturel', name: 'Culturel' },
    { id: 'sportif', name: 'Sportif' }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {admin ? 'Gestion des Actualités' : 'Toutes les Actualités'}
        </h1>
        
        {admin && (
          <Link
            to="/admin/actualites/add"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle Actualité
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
      
      {actualites.length === 0 ? (
        <p className="text-center text-gray-600">Aucune actualité disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actualites.map(actualite => (
            <ActualiteItem 
              key={actualite._id} 
              actualite={actualite}
              admin={admin}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActualitesList; 
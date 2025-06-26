import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ActualiteContext from '../../context/actualite/actualiteContext';
import AlertContext from '../../context/alert/alertContext';

const ActualiteForm = () => {
  const actualiteContext = useContext(ActualiteContext);
  const alertContext = useContext(AlertContext);
  
  const { addActualite, updateActualite, current, clearCurrent, getActualite } = actualiteContext;
  const { setAlert } = alertContext;
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [actualite, setActualite] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: 'académique'
  });
  
  useEffect(() => {
    // If editing an existing item
    if (id) {
      if (!current || (current && current._id !== id)) {
        getActualite(id);
      } else {
        setActualite({
          title: current.title,
          content: current.content,
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
  
  const { title, content, imageUrl, category } = actualite;
  
  const onChange = e => {
    setActualite({ ...actualite, [e.target.name]: e.target.value });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    if (title.trim() === '' || content.trim() === '') {
      setAlert('Merci de remplir tous les champs obligatoires', 'danger');
      return;
    }
    
    if (id) {
      // Update existing actualite
      updateActualite({
        _id: id,
        ...actualite
      });
      setAlert('Actualité mise à jour', 'success');
    } else {
      // Add new actualite
      addActualite(actualite);
      setAlert('Actualité ajoutée', 'success');
    }
    
    // Redirect to admin actualites list
    navigate('/admin/actualites');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Link 
        to="/admin/actualites" 
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? 'Modifier une actualité' : 'Ajouter une actualité'}
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
              htmlFor="content" 
              className="block text-gray-700 font-medium mb-2"
            >
              Contenu *
            </label>
            <textarea
              name="content"
              id="content"
              value={content}
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
              placeholder="/images/news-default.jpg"
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

export default ActualiteForm;

 
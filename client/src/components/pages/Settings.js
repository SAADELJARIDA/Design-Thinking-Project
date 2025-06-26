import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import axios from 'axios';
import Spinner from '../layout/Spinner';

const Settings = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  const { user, loading, loadUser } = authContext;
  const { setAlert } = alertContext;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      });
    }
    // eslint-disable-next-line
  }, [user]);
  
  const { name, email, profileImage } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onProfileSubmit = async e => {
    e.preventDefault();
    
    try {
      // Call the API to update the profile
      const res = await axios.put('/api/auth/profile', { name, profileImage });
      
      setAlert('Profil mis à jour avec succès', 'success');
      loadUser(); // Recharger les infos utilisateur
    } catch (err) {
      setAlert('Erreur lors de la mise à jour du profil', 'danger');
    }
  };
  
  if (loading || !user) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres du Compte</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Informations du Profil</h2>
        </div>
        <div className="p-6">
          <form onSubmit={onProfileSubmit}>
            <div className="flex flex-col items-center mb-6">
              <img 
                src={profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <div className="w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
                  Image URL
                </label>
                <input
                  type="text"
                  name="profileImage"
                  id="profileImage"
                  value={profileImage}
                  onChange={onChange}
                  placeholder="URL de l'image de profil"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nom
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Mettre à jour le profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
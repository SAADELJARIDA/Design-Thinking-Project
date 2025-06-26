import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import Spinner from '../layout/Spinner';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  useEffect(() => {
    getUsers();
  }, []);

  // Récupérer tous les utilisateurs
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setAlert('Erreur lors de la récupération des utilisateurs', 'danger');
      setLoading(false);
    }
  };

  // Promouvoir un utilisateur en administrateur
  const makeAdmin = async (userId) => {
    try {
      await axios.post('/api/auth/make-admin', { userId });
      setAlert('Utilisateur promu administrateur avec succès', 'success');
      // Mettre à jour la liste des utilisateurs
      getUsers();
    } catch (err) {
      console.error('Erreur lors de la promotion de l\'utilisateur:', err);
      setAlert('Erreur lors de la promotion de l\'utilisateur', 'danger');
    }
  };

  // Rétrograder un administrateur en utilisateur normal
  const removeAdmin = async (userId) => {
    try {
      await axios.post('/api/auth/remove-admin', { userId });
      setAlert('Droits d\'administrateur révoqués avec succès', 'success');
      // Mettre à jour la liste des utilisateurs
      getUsers();
    } catch (err) {
      console.error('Erreur lors de la rétrogradation de l\'administrateur:', err);
      setAlert('Erreur lors de la rétrogradation de l\'administrateur', 'danger');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Utilisateurs</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.role === 'admin' ? (
                    <button
                      onClick={() => {
                        if (window.confirm(`Êtes-vous sûr de vouloir rétrograder ${user.name} ?`)) {
                          removeAdmin(user._id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 ml-4"
                      disabled={user._id === authContext.user?._id}
                      title={user._id === authContext.user?._id ? "Vous ne pouvez pas vous rétrograder vous-même" : ""}
                    >
                      Rétrograder
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (window.confirm(`Êtes-vous sûr de vouloir promouvoir ${user.name} en administrateur ?`)) {
                          makeAdmin(user._id);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Promouvoir admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList; 
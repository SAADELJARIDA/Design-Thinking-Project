import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import Spinner from '../layout/Spinner';

// Importez une bibliothèque de graphiques, comme Chart.js
// Vous devrez l'installer: npm install react-chartjs-2 chart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    labels: [],
    datasets: [],
  });
  
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
      
      // Préparer les données pour le graphique
      prepareChartData(res.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setAlert('Erreur lors de la récupération des utilisateurs', 'danger');
      setLoading(false);
    }
  };

  // Préparer les données pour le graphique
  const prepareChartData = (userData) => {
    // Créer un objet pour stocker le nombre d'utilisateurs par date
    const usersByDate = {};
    
    // Trier les utilisateurs par date de création
    userData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Compter les utilisateurs par date
    userData.forEach(user => {
      const date = new Date(user.date).toLocaleDateString('fr-FR');
      if (!usersByDate[date]) {
        usersByDate[date] = 0;
      }
      usersByDate[date]++;
    });
    
    // Créer les tableaux pour les labels et les données
    const labels = Object.keys(usersByDate);
    const data = Object.values(usersByDate);
    
    // Calcul du nombre cumulatif d'utilisateurs
    const cumulativeData = [];
    let sum = 0;
    data.forEach(count => {
      sum += count;
      cumulativeData.push(sum);
    });
    
    // Configurer les données du graphique
    setUserStats({
      labels,
      datasets: [
        {
          label: 'Nouveaux utilisateurs par jour',
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Nombre total d\'utilisateurs',
          data: cumulativeData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    });
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord d'Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Statistiques rapides */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilisateurs</h2>
          <p className="text-4xl font-bold text-indigo-600">{users.length}</p>
          <p className="text-gray-600 mt-2">Nombre total d'utilisateurs inscrits</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Administrateurs</h2>
          <p className="text-4xl font-bold text-green-600">
            {users.filter(user => user.role === 'admin').length}
          </p>
          <p className="text-gray-600 mt-2">Nombre d'utilisateurs avec privilèges admin</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilisateurs Standards</h2>
          <p className="text-4xl font-bold text-blue-600">
            {users.filter(user => user.role === 'user').length}
          </p>
          <p className="text-gray-600 mt-2">Nombre d'utilisateurs réguliers</p>
        </div>
      </div>
      
      {/* Action rapides */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Actions Rapides</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gestion des actualités */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actualités</h3>
            <div className="flex space-x-4">
              <Link
                to="/admin/actualites"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Gérer les actualités
              </Link>
              <Link
                to="/admin/actualites/add"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une actualité
              </Link>
            </div>
          </div>
          
          {/* Gestion des événements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Événements</h3>
            <div className="flex space-x-4">
              <Link
                to="/admin/evenements"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gérer les événements
              </Link>
              <Link
                to="/admin/evenements/add"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un événement
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphique d'évolution des utilisateurs */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Évolution des Inscriptions</h2>
        <div className="h-80">
          <Line 
            data={userStats} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Évolution du nombre d\'utilisateurs'
                }
              }
            }}
          />
        </div>
      </div>
      
      {/* Gestion des utilisateurs */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
        </div>
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

export default Dashboard; 
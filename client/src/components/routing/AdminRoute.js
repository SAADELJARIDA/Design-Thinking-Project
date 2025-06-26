import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import Spinner from '../layout/Spinner';

const AdminRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;
  
  if (loading) {
    return <Spinner />;
  }
  
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default AdminRoute; 
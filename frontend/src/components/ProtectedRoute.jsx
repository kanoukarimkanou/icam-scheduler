import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/" />;
  if (adminOnly && !isAdmin) return <Navigate to="/selectionpage" />;
  return element;
};

export default ProtectedRoute;

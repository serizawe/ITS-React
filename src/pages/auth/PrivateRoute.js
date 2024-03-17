import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedUserTypes }) => {
  const userType = useSelector(state => state.auth.userType);

  if (typeof allowedUserTypes === 'string') {
    if (userType && userType === allowedUserTypes) {
      return children;
    }
  } else if (Array.isArray(allowedUserTypes)) {
    if (userType && allowedUserTypes.includes(userType)) {
      return children;
    }
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;

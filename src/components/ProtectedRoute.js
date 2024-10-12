import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const validateToken = async () => {
    
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Make a request to your backend to verify the JWT
        const response = await axios.get('http://localhost:3001/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response is successful, set isAuthenticated to true
        if (response.status === 200) {
          setIsAuthenticated(true);
        }


      } catch (error) {
        console.error('Token validation failed:', error);
        setIsAuthenticated(false);
        setErrorMessage(error.response?.data?.message || 'Token validation failed'); // Display the error message
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  // Show a loading indicator while validating the token
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Display error message if any
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return element;
};

export default ProtectedRoute;

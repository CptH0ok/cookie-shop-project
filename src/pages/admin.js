import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Admin = () => {
    const token = localStorage.getItem('token');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const checkAdmin = async() => {

        if (!token) {
            setError('');
            navigate('/login');  // Redirect to home page after login
            return;
          }

        try {
            const res = await axios.get('http://localhost:3000/admin', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

            if (res.status === 200)
            {
                setError('');
            } else {
                setError('Access Denied')
            }

            const role = jwtDecode(token).role;
            setUserRole(role);
            
        } catch (err) {
            setError('Invalid Request: ' + err.message);
            setUserRole('unauthenticated');
        }
    }
    
    checkAdmin();

    if (userRole === "admin"){
        return(
            <h2>Welcome to admin panel {error && <p>{error}</p>}</h2>
        );
    };
    return (
        <h2>{error && <p>{error}</p>}</h2>
    );
};

export default Admin;
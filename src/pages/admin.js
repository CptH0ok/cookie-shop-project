import React, { useState } from 'react';
import axios from 'axios';
import ErrorPage from './error';
import './admin.css';

const Admin = () => {
    const token = localStorage.getItem('token');
    const [error, setError] = useState('');
    const [adminPageData, setAdminPageData] = useState(null);

    const checkAdmin = async() => {

        const res = await axios.get('http://localhost:3001/admin', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }).then((res) => {;
                setAdminPageData(res.data);
        })
        .catch((err) => {
            // Handle error
            if (err.response) {
            // Server responded with a status other than 2xx
            setError(err.response.data);
            } else {
            // Something happened in setting up the request
            setError(err.response.data);
            }
        });
    }
    
    checkAdmin();

    return(
        <div className="page-container">
            <h2 className="text-center text-xl">
                {error === '' ? adminPageData : error}
            </h2>
        </div>
    )
};

export default Admin;
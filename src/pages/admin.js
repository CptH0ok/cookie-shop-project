import './admin.css';
import axios from 'axios';
import React, { useState } from 'react';

const Admin = () => {
    const token = localStorage.getItem('token');
    const [error, setError] = useState('');
    const [adminPageData, setAdminPageData] = useState(null);

    const checkAdmin = async() => {

        const res = await axios.get('http://localhost:3001/api/admin', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }).then((res) => {
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
        <div className='flex bg-unsplash-[avJ9uz9Qhcw/lg] h-dvh bg-center bg-cover pb-32'>
            <div className='relative flex z-10 top-20 left-2 mr-4 mt-5 h-full w-1/5 h-auto backdrop-contrast-50 backdrop-blur-2xl rounded-2xl'>
                <div className=''>Stats</div> 
                <div className=''>Stock</div>
                <div className=''>Branches</div>
                <div className=''></div>
                <div className=''></div>
            </div>
            <div className='relative flex z-10 top-20 mr-2 ml-4 mt-5 h-full w-4/5 h-auto backdrop-contrast-50 backdrop-blur-2xl rounded-2xl'>

            </div>
        </div>
    )
};

export default Admin;
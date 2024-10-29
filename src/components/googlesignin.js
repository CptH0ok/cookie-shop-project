import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = async (response) => {
      localStorage.setItem('token', response.credential);
      const token = response.credential;
      const res = await axios.get('http://localhost:3001/api/googlelogin', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }).then((res) => {;
            console.log("good");
    })
    .catch((err) => {
        // Handle error
        console.log("bad");
    });

    navigate('/');
    };

    const loadGoogleScript = async () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        
        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById('buttonDiv'),
          { theme: 'filled_blue', size: 'large'} // Customization attributes
        );

        // Optionally, display the One Tap dialog
        window.google.accounts.id.prompt();
      };

      document.body.appendChild(script);
    };

    loadGoogleScript();
  });

  return (
    <div>
      <div id="buttonDiv"></div>
    </div>
  );
};

export default GoogleSignIn;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn = () => {
const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = (response) => {
      localStorage.setItem('token', response.credential);
      navigate('/');  // Redirect to home page
    };

    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: "577750909481-14u39qkd1duvu6nopnc35141ecn115b5.apps.googleusercontent.com", // Replace with your actual Client ID
          callback: handleCredentialResponse,
        });
        
        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById('buttonDiv'),
          { theme: 'outline', size: 'large' } // Customization attributes
        );

        // Optionally, display the One Tap dialog
        window.google.accounts.id.prompt();
      };

      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  return (
    <div>
      <div id="buttonDiv"></div>
    </div>
  );
};

export default GoogleSignIn;

import React from 'react';
import './maps.css'; // Importing CSS for styles

const Maps = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Mikve+Israel+St+26,Tel+Aviv-Yafo,Israel`}>
      </iframe>
    </div>
  );
};

export default Maps;

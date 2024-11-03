import './reviews.css'; // Custom CSS for styles
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Reviews = () => {
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch reviews from the API
  const fetchReviews = async () => {
    const response = await axios.get('http://localhost:3001/api/pagereviews')
    .then((response) => {;
        setReviews(response.data);
    })
    .catch((err) => {
      // Handle error
      if (err) {
        // Server responded with a status other than 2xx
        setError(err.message);
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server');
      } else {
        // Something happened in setting up the request
        setError('Error setting up request');
      }
    });
  };

  // Fetch reviews on component mount and every 60 minutes (3600000 ms)
  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 3600000); // Fetch every 60 minutes
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  // Automatically switch reviews every 3 seconds unless paused
  useEffect(() => {
    if (!isPaused && reviews.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [reviews.length, isPaused]);

  // Format the date to display just the day
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if(error){
    return (
      <div class="error-container">
        <div class="error-message">
          <span class="caution">⚠️</span>
            Something went wrong! Please try again.
          <span class="caution">⚠️</span>
        </div>
        <details>
          <summary>More Info</summary>
          <p>Details: {error}</p>
        </details>
      </div>
    );
  }

  return (
    <div className="review-container">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className={`review ${index === activeIndex ? 'active' : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <p className={`recommendation ${review.recommendation_type}`}>
              {review.recommendation_type === 'positive' ? '👍' : '👎'}
            </p>
            <p className="review-text">{review.review_text}</p>
            <p className="review-date">Reviewed on: {formatDate(review.created_time)}</p>
          </div>
        ))
      ) : (
        <p>Loading reviews...</p>
      )}
    </div>
  );
};

export default Reviews;

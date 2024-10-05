import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reviews.css'; // Custom CSS for styles

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch reviews from the API
  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/pagereviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
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

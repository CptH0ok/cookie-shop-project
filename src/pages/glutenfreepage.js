import React from 'react';
import './glutenfreepage.css';
import { Link } from 'react-router-dom';

const GlutenFreePage = () => {
  return (
    <div className="gluten-free-page">
      <div className="content-container">
      <h1 className="relative text-balance z-10 text-white text-4xl font-bold font-serif tracking-tight sm:text-6xl">
        Discover the Delight of Gluten-Free Cookies!</h1>
        <p className="relative z-10 mt-6 text-lg leading-8 text-white font-serif">
          Gluten-free cookies are not only a safe option for those with gluten sensitivities or celiac disease, but they also bring a burst of flavor and creativity to the world of baking. Made with alternative flours like almond, coconut, or chickpea, these cookies can be just as delicious, if not more so, than their traditional counterparts. 
          <br /><br />
          Imagine sinking your teeth into a chewy chocolate chip cookie that’s free from gluten, yet packed with rich, buttery flavor. Gluten-free options often incorporate wholesome ingredients that are high in fiber and protein, making them a better choice for your health. 
          <br /><br />
          With endless possibilities for flavor combinations and textures, gluten-free cookies can be a delightful treat for everyone, regardless of dietary restrictions. So, whether you're gluten-sensitive or simply looking to explore new flavors, gluten-free cookies are a wonderful way to indulge guilt-free!
        </p>
        <Link to="/" className="back-link">Back to Home Page</Link>
      </div>
    </div>
  );
};

export default GlutenFreePage;

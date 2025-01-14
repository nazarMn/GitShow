import React from 'react';
import './Reviews.css';
import ReviewsCard from '../ReviewsCard/ReviewsCard';

export default function Reviews() {
  return (
    <div className="reviews">
      <header className="reviews-title-container">
        <p className="section-label">TESTIMONIALS</p>
        <h2 className="section-title">What Our Clients Say</h2>
      </header>
      <div className="reviews-container">
        <ReviewsCard
          stars={5}
          text="The education should be very interactive. Ut tincidunt est ac dolor aliquam sodales."
          name="Monisha"
          role="UX Designer"
          image="path-to-image-monisha.jpg"
        />
        <ReviewsCard
          stars={5}
          text="The education should be very interactive. Ut tincidunt est ac dolor aliquam sodales."
          name="Mesud Ozill"
          role="CEO Founder"
          image="path-to-image-mesud.jpg"
        />
        <ReviewsCard
          stars={4}
          text="Phasellus sed mauris hendrerit tincidunt est ac dolor aliquam sodales."
          name="Jane Doe"
          role="UX Designer"
          image="path-to-image-jane.jpg"
        />
      </div>
      <div className="reviews-buttons">
        <button className="prev-button">←</button>
        <button className="next-button">→</button>
      </div>
    </div>
  );
}

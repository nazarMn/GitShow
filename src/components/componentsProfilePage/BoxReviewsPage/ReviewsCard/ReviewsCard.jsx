import React from 'react';
import './ReviewsCard.css';

export default function ReviewsCard({ stars, text, name, role, image }) {
  return (
    <div className="reviews-card">
      <div className="stars">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </div>
      <p className="review-text">{text}</p>
      <div className="reviewer">
        <img src={image} alt={`${name}'s profile`} className="reviewer-image" />
        <div>
          <p className="reviewer-name">{name}</p>
          <p className="reviewer-role">{role}</p>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PublicPortfolioCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

export default function PublicPortfolioCard({ title, description, imageUrl, link, websiteUrl }) {
  const renderImage = (title, imageUrl) => {
    if (imageUrl && imageUrl.trim()) {
      return <img src={imageUrl} alt="Project Thumbnail" />;
    }

    const firstLetter = title ? title[0].toUpperCase() : 'P';
    const letterCode = firstLetter.charCodeAt(0);
    const color1 = `hsl(${(letterCode * 30) % 360}, 70%, 50%)`;
    const color2 = `hsl(${(letterCode * 70) % 360}, 70%, 50%)`;

    return (
      <div className="defaultImage" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}>
        <span>{firstLetter}</span>
      </div>
    );
  };

  return (
    <div className="portfolioCard">
      <div className="cardImage">{renderImage(title, imageUrl)}</div>
      <div className="cardOverlay">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="cardIcons">
        <a href={link} className="githubIcon" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} size="2x" color="#fff" />
        </a>
        {websiteUrl && (
          <a href={websiteUrl} className="websiteIcon" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faPaperclip} size="2x" color="#fff" />
          </a>
        )}
      </div>
    </div>
  );
}

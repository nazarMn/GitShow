import React, { useState } from 'react';
import './ProjectCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';

export default function ProjectCard({ title, description, imageUrl, link, websiteUrl }) {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="projectCard">
      <div className="cardImage">
        <img src={imageUrl || './img/project.jpg'} alt="Project Thumbnail" />
      </div>
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
        <span className={`saveIcon ${isSaved ? 'starred' : ''}`} onClick={toggleSave}>
          <FontAwesomeIcon icon={isSaved ? solidStar : regularStar} size="2x" color={isSaved ? 'gold' : 'white'} />
        </span>
      </div>
    </div>
  );
}
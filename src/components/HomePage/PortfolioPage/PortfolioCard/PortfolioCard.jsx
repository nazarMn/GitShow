import React from 'react';
import './PortfolioCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function PortfolioCard({ title, description, imageUrl, link, websiteUrl, onDelete }) {
  return (
    <div className="portfolioCard">
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
        <FontAwesomeIcon
          icon={faTrash}
          size="2x"
          className="deleteIcon"
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

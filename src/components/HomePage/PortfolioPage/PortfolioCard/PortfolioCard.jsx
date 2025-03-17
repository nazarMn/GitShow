import React from 'react';
import './PortfolioCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function PortfolioCard({ title, description, imageUrl, link, websiteUrl, onDelete, onEdit }) {
  const renderImage = () => {
    if (imageUrl && imageUrl.trim()) {
      return <img src={imageUrl} alt="Project Thumbnail" />;
    }

    const firstLetter = title ? title[0].toUpperCase() : 'P';
    return (
      <div className="defaultImage">
        <span>{firstLetter}</span>
      </div>
    );
  };

  return (
    <div className="portfolioCard">
      <div className="cardImage">{renderImage()}</div>
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
        <FontAwesomeIcon icon={faTrash} size="2x" className="deleteIcon" onClick={onDelete} />
        <FontAwesomeIcon icon={faEdit} size="2x" className="editIcon" onClick={onEdit} />
      </div>
    </div>
  );
}

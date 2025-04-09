import React from 'react';
import './PortfolioCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function PortfolioCard({ title, description, imageUrl, link, websiteUrl, onDelete, onEdit, showDelEdit }) {

    const location = useLocation(); 

    const shouldShowDelEdit = location.pathname === '/home' || showDelEdit; 

  const renderImage = () => {
    if (imageUrl && imageUrl.trim()) {
      return <img src={imageUrl} alt="Project Thumbnail" />;
    }

    const firstLetter = title ? title[0].toUpperCase() : 'P';

    // Генерація унікального кольору градієнта на основі першої букви
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

        {shouldShowDelEdit  && (
            <>
        <FontAwesomeIcon icon={faTrash} size="2x" className="deleteIcon" onClick={onDelete} />
        <FontAwesomeIcon icon={faEdit} size="2x" className="editIcon" onClick={onEdit} />
        </>
        )}
      </div>
    </div>
  );
}

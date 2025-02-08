import React, { useState, useEffect } from 'react';
import './ProjectCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';

export default function ProjectCard({ title, description, imageUrl, link, websiteUrl, userAvatar }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
    const isProjectSaved = savedProjects.some(project => project.title === title);
    setIsSaved(isProjectSaved);
  }, [title]);

  const toggleSave = () => {
    const project = {
      title,
      description,
      imageUrl,
      link,
      websiteUrl,
      userAvatar
    };
    
    let savedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
    
    if (isSaved) {
      savedProjects = savedProjects.filter(project => project.title !== title);
    } else {
      savedProjects.push(project);
    }
    
    localStorage.setItem('bookmarkedProjects', JSON.stringify(savedProjects));
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
        <div className="cardIconsLeft">
          <div className="userAvatar">
            <img src={userAvatar || './img/account.png'} alt="User Avatar" className="avatar" />
          </div>
        </div>
        <div className="cardIconsRight">
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
    </div>
  );
}

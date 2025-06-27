import React from 'react';
import './ProjectCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import { useBookmarks, useToggleBookmark } from '../../hooks/useBookmarks';

export default function ProjectCard({ title, description, imageUrl, link, websiteUrl, userAvatar, userId }) {
  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const isSaved = bookmarks.some((proj) => proj.title === title);

  const handleToggle = () => {
    const project = { title, description, imageUrl, link, websiteUrl, userAvatar };
    toggleBookmark.mutate({ project, isSaved });
  };

  const renderImage = () => {
    if (imageUrl?.trim()) return <img src={imageUrl} alt="Project Thumbnail" />;
    const firstLetter = title?.[0]?.toUpperCase() || 'P';
    const color1 = `hsl(${firstLetter.charCodeAt(0) * 30 % 360}, 70%, 50%)`;
    const color2 = `hsl(${firstLetter.charCodeAt(0) * 70 % 360}, 70%, 50%)`;

    return (
      <div className="defaultImage" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}>
        <span>{firstLetter}</span>
      </div>
    );
  };

  return (
    <div className="projectCard">
      <div className="cardImage">{renderImage()}</div>
      <div className="cardOverlay">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="cardIcons">
        <div className="cardIconsLeft">
          <div className="userAvatar" onClick={() => window.location.href = `/public-profile/${userId}`} style={{ cursor: 'pointer' }}>
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
          <span className={`saveIcon ${isSaved ? 'starred' : ''}`} onClick={handleToggle}>
            <FontAwesomeIcon icon={isSaved ? solidStar : regularStar} size="2x" color={isSaved ? 'gold' : 'white'} />
          </span>
        </div>
      </div>
    </div>
  );
}

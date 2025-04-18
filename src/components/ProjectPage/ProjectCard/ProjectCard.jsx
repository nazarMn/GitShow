import React, { useState, useEffect } from 'react';
import './ProjectCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';

export default function ProjectCard({ title, description, imageUrl, link, websiteUrl, userAvatar, userId  }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks');
        const bookmarks = await response.json();
        setIsSaved(bookmarks.some(proj => proj.title === title));
      } catch (error) {
        console.error('Помилка при отриманні закладок:', error);
      }
    };

    fetchBookmarks();
  }, [title]);

  const toggleSave = async () => {
    try {
      const project = { title, description, imageUrl, link, websiteUrl, userAvatar };

      if (isSaved) {
        await fetch('/api/bookmark', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
      } else {
        await fetch('/api/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project)
        });
      }

      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Помилка при оновленні закладок:', error);
    }
  };

  const renderImage = () => {
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

  const handleUserClick = (userId) => {
    window.location.href = `/public-profile/${userId}`;
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
        <div className="userAvatar" onClick={() => handleUserClick(userId)} style={{ cursor: 'pointer' }}>
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
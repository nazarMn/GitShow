import React, { useEffect, useState } from 'react';
import './BookmarksPage.css';
import ProjectCard from '../ProjectCard/ProjectCard'; 

export default function BookmarksPage() {
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
    setBookmarkedProjects(savedProjects);
  }, []);

  return (
    <div className="bookmarks-container">
      <header className="bookmarks-header">Your Bookmarked Projects</header>
      <div className="bookmarks-grid">
        {bookmarkedProjects.length > 0 ? (
          bookmarkedProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
              link={project.link}
              websiteUrl={project.websiteUrl}
              userAvatar={project.userAvatar}
            />
          ))
        ) : (
          <p>No bookmarked projects yet.</p>
        )}
      </div>
    </div>
  );
}

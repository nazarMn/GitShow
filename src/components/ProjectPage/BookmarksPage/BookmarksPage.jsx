import React, { useEffect, useState } from 'react';
import './BookmarksPage.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import axios from 'axios';

export default function BookmarksPage() {
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('/api/bookmarks');
        setBookmarkedProjects(response.data);
      } catch (error) {
        console.error('Помилка при отриманні закладок:', error);
      }
    };

    fetchBookmarks();
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

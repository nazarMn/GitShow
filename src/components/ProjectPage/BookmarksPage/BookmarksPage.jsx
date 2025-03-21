import React, { useEffect, useState } from 'react';
import './BookmarksPage.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import axios from 'axios';

export default function BookmarksPage() {
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('https://gitshow.onrender.com/api/bookmarks');
        
        // Перевіряємо, чи `response.data` є масивом, щоб уникнути помилок .map()
        if (Array.isArray(response.data)) {
          setBookmarkedProjects(response.data);
        } else {
          setBookmarkedProjects([]); // Якщо формат невірний, встановлюємо порожній масив
        }
      } catch (error) {
        console.error('Помилка при отриманні закладок:', error);
        setBookmarkedProjects([]); // У разі помилки очищаємо список
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="bookmarks-container">
      <header className="bookmarks-header">Your Bookmarked Projects</header>
      
      <div className="bookmarks-grid">
        {Array.isArray(bookmarkedProjects) && bookmarkedProjects.length > 0 ? (
          bookmarkedProjects.map((project) => (
            <ProjectCard
              key={project._id} // Використовуємо `project._id` замість `index`
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
              link={project.link}
              websiteUrl={project.websiteUrl}
              userAvatar={project.userAvatar}
            />
          ))
        ) : (
          <p className="no-bookmarks">No bookmarked projects yet.</p> 
        )}
      </div>
    </div>
  );
}

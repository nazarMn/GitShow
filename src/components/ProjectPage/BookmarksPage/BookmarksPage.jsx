import React from 'react';
import './BookmarksPage.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import { useBookmarks } from '../../hooks/useBookmarks';

export default function BookmarksPage() {
  const { data: bookmarkedProjects = [], isLoading } = useBookmarks();

  return (
    <div className="bookmarks-container">
      <header className="bookmarks-header">Your Bookmarked Projects</header>

      <div className="bookmarks-grid">
        {isLoading ? (
          <p>Завантаження...</p>
        ) : bookmarkedProjects.length > 0 ? (
          bookmarkedProjects.map((project) => (
            <ProjectCard key={project._id} {...project} />
          ))
        ) : (
          <p className="no-bookmarks">No bookmarked projects yet.</p>
        )}
      </div>
    </div>
  );
}

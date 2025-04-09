import React, { useState } from 'react';
import './PortfolioWorks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import GitHubProjectsPopup from '../GitHubProjectsPopup/GitHubProjectsPopup';

export default function PortfolioWorks() {
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGitHubProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/github/projects');
      const data = await response.json();
      
      // Переконуємось, що `data` - це масив
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]); // Якщо бекенд повернув не масив, скидаємо проєкти
      }
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      setProjects([]); // У разі помилки також скидаємо список
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
    fetchGitHubProjects();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddProject = (project) => {
    navigate('/settings-projects', { state: { project } });
    setShowPopup(false);
  };

  return (
    <div className="portfolioWorks">
      <div className="AddWorksBox">
        <div className="AddWorks" onClick={handleOpenPopup}>
          <FontAwesomeIcon icon={faPlus} size="2xl" color="#fff" cursor="pointer" rotate={45} />
        </div>
      </div>

      {showPopup && (
  <GitHubProjectsPopup
    projects={projects}
    isLoading={isLoading}
    onClose={handleClosePopup}
    onAdd={handleAddProject}
  />
)}
    </div>
  );
}

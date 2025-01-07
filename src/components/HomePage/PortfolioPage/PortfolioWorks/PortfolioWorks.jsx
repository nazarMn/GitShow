import React, { useState } from 'react';
import './PortfolioWorks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function PortfolioWorks() {
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);

  // Функція для завантаження проектів користувача з GitHub
  const fetchGitHubProjects = async () => {
    try {
      const response = await fetch('/api/github/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
    }
  };
  

  // Відкрити попап
  const handleOpenPopup = () => {
    setShowPopup(true);
    fetchGitHubProjects();
  };

  // Закрити попап
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Додати проект (можна реалізувати API-запит для збереження)
  const handleAddProject = (project) => {
    console.log('Adding project:', project);
    // Тут можна викликати API для збереження проекту
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
        <div className="popupOverlay">
          <div className="popupContent">
            <button className="closeButton" onClick={handleClosePopup}>
              ✖
            </button>
            <h3>Your GitHub Projects</h3>
            {projects.length > 0 ? (
              <ul className="projectsList">
                {projects.map((project) => (
                  <li key={project.id} className="projectItem">
                    <span>{project.name}</span>
                    <button onClick={() => handleAddProject(project)}>Add</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import './PortfolioWorks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

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
      setProjects(data);
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
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
        <div className="popupOverlay">
          <div className="popupContent">
            <button className="closeButton" onClick={handleClosePopup}>
              ✖
            </button>
            <h3>Your GitHub Projects</h3>
            {isLoading ? (
              <p>Loading projects...</p>
            ) : (
              <ul className="projectsList">
                {projects.map((project) => (
                  <li key={project.id} className="projectItem">
                    <span>{project.name}</span>
                    <button onClick={() => handleAddProject(project)}>Add</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';

import './GitHubProjectsPopup.css';

export default function GitHubProjectsPopup({ projects, isLoading, onClose, onAdd }) {
  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <button className="closeButton" onClick={onClose}>✖</button>
        <h3>Your GitHub Projects</h3>
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          <ul className="projectsList">
            {projects.map((project) => (
              <li key={project.id || project.name} className="projectItem">
                <span>{project.name}</span>
                <button onClick={() => onAdd(project)}>Add</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
}

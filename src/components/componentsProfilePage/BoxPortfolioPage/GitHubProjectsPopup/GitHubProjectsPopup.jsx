import React, { useState } from 'react';
import './GitHubProjectsPopup.css';

export default function GitHubProjectsPopup({ projects, isLoading, onClose, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="popupOverlay">
      <div className="popupContent animated">
        <button className="closeButton" onClick={onClose}>✖</button>
        <h3>Your GitHub Projects</h3>

        {!isLoading && projects.length > 0 && (
          <input
            type="text"
            placeholder="Search by project name..."
            className="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {isLoading ? (
          <p className="infoText">Loading projects...</p>
        ) : filteredProjects.length > 0 ? (
          <ul className="projectsList">
            {filteredProjects.map((project) => (
              <li key={project.id || project.name} className="projectItem">
                <span className="projectName">{project.name}</span>
                <button className="addButton" onClick={() => onAdd(project)}>Add</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="infoText">No matching projects found.</p>
        )}
      </div>
    </div>
  );
}

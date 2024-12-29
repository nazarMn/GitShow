import React from 'react';
import './SettingsProjects.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function SettingsProjects() {
  return (
    <div className="settingsProjects">
      <button className="closeButton" onClick={() => console.log('Exit clicked')}>X</button>
      <div className="contentContainer">
        <div className="settingsProjectsLeft">
          <h2 className="photoTitle">Project Photo</h2>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGASx-6IDvxTqQ532yrbRX13HEmcAkSKWw8Q&s" 
            alt="Project" 
          />
          <FontAwesomeIcon icon={faPencil} className="editIcon" />
        </div>
        <div className="settingsProjectsRight">
          <div className="form-group">
            <label htmlFor="nameproject">Name Project</label>
            <input
              type="text"
              id="nameproject"
              placeholder="Name Project"
            />
          </div>
          <div className="form-group">
            <label htmlFor="linkproject">Link Project</label>
            <input
              type="text"
              id="linkproject"
              placeholder="Link Project"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionproject">Description Project</label>
            <textarea
              id="descriptionproject"
              placeholder="Description Project"
            />
          </div>
          <button className="saveButton" onClick={() => console.log('Save clicked')}>Save</button>
        </div>
      </div>
    </div>
  );
}
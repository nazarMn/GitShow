import React, { useState, useEffect } from 'react';
import './SettingsProjects.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

export default function SettingsProjects() {
  const location = useLocation();
  const { project } = location.state || {};
  
  const [name, setName] = useState(project?.name || '');
  const [link, setLink] = useState(project?.url || '');
  const [description, setDescription] = useState(project?.description || '');
  const [image, setImage] = useState(null); // Initially null

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Update image state with selected file
  };

  const handleSave = async () => {
    if (!name || !link || !description) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('link', link);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/projects', { method: 'POST', body: formData });
      if (response.ok) {
        console.log('Project saved');
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="settingsProjects">
      <button className="closeButton" onClick={() => console.log('Exit clicked')}>X</button>
      <div className="contentContainer">
        <div className="settingsProjectsLeft">
          <h2 className="photoTitle">Project Photo</h2>
          <img 
            src={image ? URL.createObjectURL(image) : ''} // Show selected image or empty if none selected
            alt="Project" 
          />
          <FontAwesomeIcon 
            icon={faPencil} 
            className="editIcon" 
            onClick={() => document.getElementById('fileInput').click()} 
          />
          <input 
            id="fileInput" 
            type="file" 
            style={{ display: 'none' }} 
            onChange={handleImageChange} 
          />
        </div>
        <div className="settingsProjectsRight">
          <div className="form-group">
            <label htmlFor="nameproject">Name Project</label>
            <input
              type="text"
              id="nameproject"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name Project"
            />
          </div>
          <div className="form-group">
            <label htmlFor="linkproject">Link Project</label>
            <input
              type="text"
              id="linkproject"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link Project"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionproject">Description Project</label>
            <textarea
              id="descriptionproject"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description Project"
            />
          </div>
          <button className="saveButton" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

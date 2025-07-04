import React, { useState } from 'react';
import './SettingsProjects.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SettingsProjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const { project } = location.state || {};
  const [name, setName] = useState(project?.name || '');
  const [link, setLink] = useState(project?.url || '');
  const [description, setDescription] = useState(project?.description || '');
  const [websiteUrl, setWebsiteUrl] = useState(project?.websiteUrl || '');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleSave = async () => {
    if (!name) {
      alert('Project name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (link) formData.append('link', link);
    if (description) formData.append('description', description);
    if (websiteUrl) formData.append('websiteUrl', websiteUrl);
    if (image) formData.append('image', image);

    try {
      const response = await fetch('/api/projects', { method: 'POST', body: formData });
      if (response.ok) {
        navigate('/home');
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="settingsProjects">
      <button className="closeButton" onClick={() => navigate(-1)}>✖</button>
      <div className="contentContainer">
        <div className="settingsProjectsLeft">
          <div className="imageUploadContainer" onClick={() => document.getElementById('fileInput').click()}>
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Project" className="previewImage" />
            ) : (
              <div className="uploadPlaceholder">
                <FontAwesomeIcon icon={faUpload} className="uploadIcon" />
                <p>Upload Project Image</p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="settingsProjectsRight">
          <div className="form-group">
            <label htmlFor="nameproject">Project Name</label>
            <input
              type="text"
              id="nameproject"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="websiteurl">Website URL</label>
            <input
              type="text"
              id="websiteurl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Website URL (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionproject">Description</label>
            <textarea
              id="descriptionproject"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>
          <button className="saveButton" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

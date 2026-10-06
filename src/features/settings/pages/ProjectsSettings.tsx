import React, { useState } from 'react';
import type { ProjectRecord } from '@/shared/types/domain';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { tw } from '@/shared/lib/tailwind';


export default function SettingsProjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const { project } = (location.state ?? {}) as { project?: ProjectRecord };
  const [name, setName] = useState(project?.name || '');
  const [link, setLink] = useState(project?.url || '');
  const [description, setDescription] = useState(project?.description || '');
  const [websiteUrl, setWebsiteUrl] = useState(project?.websiteUrl || '');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    <div className={tw("settingsProjects")}>
      <button className={tw("closeButton")} onClick={() => navigate(-1)}>✖</button>
      <div className={tw("contentContainer")}>
        <div className={tw("settingsProjectsLeft")}>
          <div className={tw("imageUploadContainer")} onClick={() => document.getElementById('fileInput')?.click()}>
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Project" className={tw("previewImage")} />
            ) : (
              <div className={tw("uploadPlaceholder")}>
                <FontAwesomeIcon icon={faUpload} className={tw("uploadIcon")} />
                <p>Upload Project Image</p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className={tw('hidden')}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className={tw("settingsProjectsRight")}>
          <div className={tw("form-group")}>
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
          <div className={tw("form-group")}>
            <label htmlFor="websiteurl">Website URL</label>
            <input
              type="text"
              id="websiteurl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Website URL (optional)"
            />
          </div>
          <div className={tw("form-group")}>
            <label htmlFor="descriptionproject">Description</label>
            <textarea
              id="descriptionproject"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>
          <button className={tw("saveButton")} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

import './EditProjectModal.css';

export default function EditProjectModal({ project, onClose, onSave, onChange }) {
  return (
    <div className="modal">
      <div className="modalContent">
        <h3>Edit Project</h3>
        <label>
          Name:
          <input type="text" name="name" value={project.name} onChange={onChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={project.description} onChange={onChange} />
        </label>
        <label>
          Website URL:
          <input type="text" name="websiteUrl" value={project.websiteUrl} onChange={onChange} />
        </label>
        <label>
          Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => onChange({ target: { name: 'image', value: e.target.files[0] } })}
          />
        </label>
        <div className="modalActions">
          <button onClick={onSave}>Save Changes</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

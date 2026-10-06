import React from 'react';
import { tw } from '@/shared/lib/tailwind';



interface EditableProject {
  name?: string;
  description?: string;
  websiteUrl?: string;
}

interface EditProjectModalProps {
  project: EditableProject;
  onClose: () => void;
  onSave: () => void;
  onChange: (event: { target: { name: string; value: string | File | undefined } }) => void;
}

export default function EditProjectModal({ project, onClose, onSave, onChange }: EditProjectModalProps) {
  return (
    <div className={tw("modal")}>
      <div className={tw("modalContent")}>
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
            onChange={(e) => onChange({ target: { name: 'image', value: e.target.files?.[0] } })}
          />
        </label>
        <div className={tw("modalActions")}>
          <button onClick={onSave}>Save Changes</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

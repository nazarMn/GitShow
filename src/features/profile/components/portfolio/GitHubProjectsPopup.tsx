import React, { useState } from 'react';
import type { ProjectRecord } from '@/shared/types/domain';
import { tw } from '@/shared/lib/tailwind';


interface GitHubProjectsPopupProps { projects: ProjectRecord[]; isLoading: boolean; onClose: () => void; onAdd: (project: ProjectRecord) => void; }

export default function GitHubProjectsPopup({ projects, isLoading, onClose, onAdd }: GitHubProjectsPopupProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter((project) =>
    (project.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={tw("popupOverlay")}>
      <div className={tw("popupContent animated")}>
        <button className={tw("closeButton")} onClick={onClose}>✖</button>
        <h3>Your GitHub Projects</h3>

        {!isLoading && projects.length > 0 && (
          <input
            type="text"
            placeholder="Search by project name..."
            className={tw("searchInput")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {isLoading ? (
          <p className={tw("infoText")}>Loading projects...</p>
        ) : filteredProjects.length > 0 ? (
          <ul className={tw("projectsList")}>
            {filteredProjects.map((project) => (
              <li key={project.id || project.name} className={tw("projectItem")}>
                <span className={tw("projectName")}>{project.name}</span>
                <button className={tw("addButton")} onClick={() => onAdd(project)}>Add</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={tw("infoText")}>No matching projects found.</p>
        )}
      </div>
    </div>
  );
}

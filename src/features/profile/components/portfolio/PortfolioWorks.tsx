import React, { useState } from 'react';
import type { ProjectRecord } from '@/shared/types/domain';
import { readJson } from '@/shared/lib/http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import GitHubProjectsPopup from "@/features/profile/components/portfolio/GitHubProjectsPopup";
import { tw } from '@/shared/lib/tailwind';


export default function PortfolioWorks() {
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGitHubProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/github/projects');
      const data = await readJson<ProjectRecord[]>(response);

      // Переконуємось, що `data` - це масив
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]); // Якщо бекенд повернув не масив, скидаємо проєкти
      }
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      setProjects([]); // У разі помилки також скидаємо список
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

  const handleAddProject = (project: ProjectRecord) => {
    navigate('/settings-projects', { state: { project } });
    setShowPopup(false);
  };

  return (
    <div className={tw("portfolioWorks")}>
      <div className={tw("AddWorksBox")}>
        <div className={tw("AddWorks")} onClick={handleOpenPopup} role="button" aria-label="Add project">
          <FontAwesomeIcon icon={faPlus} size="2xl" color="#fff" cursor="pointer" />
        </div>
      </div>

      {showPopup && (
  <GitHubProjectsPopup
    projects={projects}
    isLoading={isLoading}
    onClose={handleClosePopup}
    onAdd={handleAddProject}
  />
)}
    </div>
  );
}

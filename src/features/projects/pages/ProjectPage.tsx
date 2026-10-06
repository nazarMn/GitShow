import React, { useEffect, useState } from 'react';
import type { ProjectRecord } from '@/shared/types/domain';
import ProjectCard from "@/features/projects/components/ProjectCard";
import ProjectInput from "@/features/projects/components/ProjectInput";
import axios from 'axios';
import { tw } from '@/shared/lib/tailwind';


export default function Project() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<ProjectRecord[]>('/api/projects');

        // Переконуємося, що отримані дані є масивом
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          setProjects([]); // У разі невірного формату повертаємо порожній масив
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // У разі помилки очищаємо список
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className={tw("project-container")}>
      <header className={tw("project-header")}>Projects</header>

      <ProjectInput />

      <div className={tw("project-grid")}>
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.name ?? project.title ?? 'Project'}
              description={project.description}
              imageUrl={project.imageUrl}
              link={project.link}
              websiteUrl={project.websiteUrl}
              userAvatar={project.userAvatar}
              userId={project.userId}
            />
          ))
        ) : (
          <p className={tw("no-projects")}>No projects found</p>
        )}
      </div>
    </div>
  );
}

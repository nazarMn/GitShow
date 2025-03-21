import React, { useEffect, useState } from 'react';
import './Project.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectInput from '../ProjectInput/ProjectInput';
import axios from 'axios';

export default function Project() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://gitshow.onrender.com/api/projects');

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
    <div className="project-container">
      <header className="project-header">Projects</header>

      <ProjectInput />

      <div className="project-grid">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.name}
              description={project.description}
              imageUrl={project.imageUrl}
              link={project.link}
              websiteUrl={project.websiteUrl}
              userAvatar={project.userAvatar}
            />
          ))
        ) : (
          <p className="no-projects">No projects found</p> // Додаємо повідомлення, якщо немає проектів
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import './Project.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import axios from 'axios';

export default function Project() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="project-container">
      <header className="project-header">Projects</header>

      <div className="project-input">
        <input type="text" placeholder="Search puple" />
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            title={project.name}
            description={project.description}
            imageUrl={project.imageUrl}
            link={project.link}
            websiteUrl={project.websiteUrl}
            userAvatar={project.userAvatar}
          />
        ))}
      </div>
    </div>
  );
}
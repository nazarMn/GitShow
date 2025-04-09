import React from 'react';
import PortfolioCard from '../PortfolioCard/PortfolioCard';

import './PortfolioGrid.css';

export default function PortfolioGrid({ projects, onDelete, onEdit }) {
  if (!projects.length) return <p>No projects available to display.</p>;

  return (
    <div className="portfolioGrid">
      {projects.map((project) => (
        <PortfolioCard
          key={project._id}
          title={project.name}
          description={project.description}
          imageUrl={project.imageUrl}
          link={project.link}
          websiteUrl={project.websiteUrl}
          onDelete={() => onDelete(project._id)}
          onEdit={() => onEdit(project)}
        />
      ))}
    </div>
  );
}

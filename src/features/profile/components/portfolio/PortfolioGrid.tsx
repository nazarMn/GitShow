import React from 'react';
import PortfolioCard from "@/features/profile/components/portfolio/PortfolioCard";
import type { ProjectRecord } from '@/shared/types/domain';
import { tw } from '@/shared/lib/tailwind';



interface PortfolioGridProps {
  projects: ProjectRecord[];
  onDelete?: (projectId: string) => void;
  onEdit?: (project: ProjectRecord) => void;
}

export default function PortfolioGrid({ projects, onDelete, onEdit }: PortfolioGridProps) {
  if (!projects.length) return <p>No projects available to display.</p>;

  return (
    <div className={tw("portfolioGrid")}>
      {projects.map((project, index) => (
        <PortfolioCard
          key={project._id ?? project.id ?? index}
          title={project.name ?? project.title ?? 'Project'}
          description={project.description}
          imageUrl={project.imageUrl}
          link={project.link}
          websiteUrl={project.websiteUrl}
          onDelete={() => { if (project._id) onDelete?.(project._id); }}
          onEdit={() => onEdit?.(project)}
        />
      ))}
    </div>
  );
}

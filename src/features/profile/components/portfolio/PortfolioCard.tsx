import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { tw } from '@/shared/lib/tailwind';


interface PortfolioCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  websiteUrl?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  showDelEdit?: boolean;
}

export default function PortfolioCard({ title, description, imageUrl, link, websiteUrl, onDelete, onEdit, showDelEdit = false }: PortfolioCardProps) {

    const location = useLocation();

    const shouldShowDelEdit = location.pathname === '/home' || showDelEdit;

  const renderImage = () => {
    if (imageUrl && imageUrl.trim()) {
      return <img src={imageUrl} alt="Project Thumbnail" />;
    }

    const firstLetter = title ? title[0].toUpperCase() : 'P';

    // Генерація унікального кольору градієнта на основі першої букви
    const letterCode = firstLetter.charCodeAt(0);


    const color1 = `hsl(${(letterCode * 30) % 360}, 70%, 50%)`;
    const color2 = `hsl(${(letterCode * 70) % 360}, 70%, 50%)`;

    return (
      <div className={tw("defaultImage bg-[linear-gradient(135deg,var(--project-color-1),var(--project-color-2))]")} style={{ '--project-color-1': color1, '--project-color-2': color2 } as React.CSSProperties}>
        <span>{firstLetter}</span>
      </div>
    );
  };

  return (
    <div className={tw("portfolioCard")}>
      <div className={tw("cardImage")}>{renderImage()}</div>
      <div className={tw("cardOverlay")}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={tw("cardIcons")}>
        <a href={link} className={tw("githubIcon")} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} size="2x" color="#fff" />
        </a>
        {websiteUrl && (
          <a href={websiteUrl} className={tw("websiteIcon")} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faPaperclip} size="2x" color="#fff" />
          </a>
        )}

        {shouldShowDelEdit  && (
            <>
        <FontAwesomeIcon icon={faTrash} size="2x" className={tw("deleteIcon")} onClick={onDelete} />
        <FontAwesomeIcon icon={faEdit} size="2x" className={tw("editIcon")} onClick={onEdit} />
        </>
        )}
      </div>
    </div>
  );
}

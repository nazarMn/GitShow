import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPaperclip, faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';

interface ProjectCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  websiteUrl?: string;
  userAvatar?: string;
  userId?: string;
}
import { useBookmarks, useToggleBookmark } from "@/shared/hooks/useBookmarks";
import type { BookmarkProject } from "@/shared/hooks/useBookmarks";
import { tw } from '@/shared/lib/tailwind';


export default function ProjectCard({ title, description, imageUrl, link, websiteUrl, userAvatar, userId }: ProjectCardProps) {
  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const isSaved = bookmarks.some((proj: BookmarkProject) => proj.title === title);

  const handleToggle = () => {
    const project = { title, description, imageUrl, link, websiteUrl, userAvatar };
    toggleBookmark.mutate({ project, isSaved });
  };

  const renderImage = () => {
    if (imageUrl?.trim()) return <img src={imageUrl} alt="Project Thumbnail" />;
    const firstLetter = title?.[0]?.toUpperCase() || 'P';
    const color1 = `hsl(${firstLetter.charCodeAt(0) * 30 % 360}, 70%, 50%)`;
    const color2 = `hsl(${firstLetter.charCodeAt(0) * 70 % 360}, 70%, 50%)`;

    return (
      <div className={tw("defaultImage bg-[linear-gradient(135deg,var(--project-color-1),var(--project-color-2))]")} style={{ '--project-color-1': color1, '--project-color-2': color2 } as React.CSSProperties}>
        <span>{firstLetter}</span>
      </div>
    );
  };

  return (
    <div className={tw("projectCard")}>
      <div className={tw("cardImage")}>{renderImage()}</div>
      <div className={tw("cardOverlay")}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={tw("cardIcons")}>
        <div className={tw("cardIconsLeft")}>
          <div className={tw("userAvatar cursor-pointer")} onClick={() => window.location.href = `/public-profile/${userId}`} >
            <img src={userAvatar || './img/account.png'} alt="User Avatar" className={tw("avatar")} />
          </div>
        </div>
        <div className={tw("cardIconsRight")}>
          <a href={link} className={tw("githubIcon")} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} size="2x" color="#fff" />
          </a>
          {websiteUrl && (
            <a href={websiteUrl} className={tw("websiteIcon")} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faPaperclip} size="2x" color="#fff" />
            </a>
          )}
          <span className={tw(`saveIcon ${isSaved ? 'starred' : ''}`)} onClick={handleToggle}>
            <FontAwesomeIcon icon={isSaved ? solidStar : regularStar} size="2x" color={isSaved ? 'gold' : 'white'} />
          </span>
        </div>
      </div>
    </div>
  );
}

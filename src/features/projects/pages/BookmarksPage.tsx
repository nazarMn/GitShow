import React from 'react';
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useBookmarks } from "@/shared/hooks/useBookmarks";
import { tw } from '@/shared/lib/tailwind';


export default function BookmarksPage() {
  const { data: bookmarkedProjects = [], isLoading } = useBookmarks();

  return (
    <div className={tw("bookmarks-container")}>
      <header className={tw("bookmarks-header")}>Your Bookmarked Projects</header>

      <div className={tw("bookmarks-grid")}>
        {isLoading ? (
          <p>Завантаження...</p>
        ) : bookmarkedProjects.length > 0 ? (
          bookmarkedProjects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} {...project} />
          ))
        ) : (
          <p className={tw("no-bookmarks")}>No bookmarked projects yet.</p>
        )}
      </div>
    </div>
  );
}

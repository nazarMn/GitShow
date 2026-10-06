import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faFileLines,
  faBrain,
  faCog,
  faEdit,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, Link } from 'react-router-dom';
import { tw } from '@/shared/lib/tailwind';

interface SettingsSidebarProps {
  hasCV?: boolean;
}

export default function SettingsSidebar({ hasCV = false }: SettingsSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath.toLowerCase() === path.toLowerCase();

  return (
    <div className={tw("settings-sidebar")}>
      <nav>
        <ul>
          <Link to="/PublicProfileSettings">
            <li className={tw(isActive('/PublicProfileSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faUser} /> Public profile
            </li>
          </Link>
          <Link to="/settings-projects">
            <li className={tw(isActive('/settings-projects') ? 'active' : '')}>
              <FontAwesomeIcon icon={faFolderOpen} /> Projects
            </li>
          </Link>
          <Link to="/ResumeSettings">
            <li className={tw(isActive('/ResumeSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faFileLines} /> Resume
            </li>
          </Link>
          <Link to="/SkillsSettings">
            <li className={tw(isActive('/SkillsSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faBrain} /> Skills
            </li>
          </Link>
          <Link to="/CVModels">
            <li className={tw(isActive('/CVModels') ? 'active' : '')}>
              <FontAwesomeIcon icon={faFileLines} /> CV
            </li>
          </Link>
          {hasCV && (
            <Link to="/CVEdit">
              <li className={tw(isActive('/CVEdit') ? 'active' : '')}>
                <FontAwesomeIcon icon={faEdit} /> Edit CV
              </li>
            </Link>
          )}
          <Link to="/GlobalSettings">
            <li className={tw(isActive('/GlobalSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faCog} /> Global
            </li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}

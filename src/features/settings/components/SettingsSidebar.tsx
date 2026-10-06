import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faFileLines,
  faBrain,
  faCog,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { tw } from '@/shared/lib/tailwind';


interface SettingsSidebarProps {
  hasCV?: boolean;
}

export default function SettingsSidebar({ hasCV = false }: SettingsSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className={tw("settings-sidebar")}>
      <nav>
        <ul>
          <a href="/PublicProfileSettings">
            <li className={tw(isActive('/PublicProfileSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faUser} /> Public profile
            </li>
          </a>
          <a href="/ResumeSettings">
            <li className={tw(isActive('/ResumeSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faFileLines} /> Resume
            </li>
          </a>
          <a href="/SkillsSettings">
            <li className={tw(isActive('/SkillsSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faBrain} /> Skills
            </li>
          </a>
          <a href="/CVModels">
            <li className={tw(isActive('/CVModels') ? 'active' : '')}>
              <FontAwesomeIcon icon={faFileLines} /> CV
            </li>
          </a>
          {hasCV && (
            <a href="/CVEdit">
              <li className={tw(isActive('/CVEdit') ? 'active' : '')}>
                <FontAwesomeIcon icon={faEdit} /> Edit CV
              </li>
            </a>
          )}
          <a href="/GlobalSettings">
            <li className={tw(isActive('/GlobalSettings') ? 'active' : '')}>
              <FontAwesomeIcon icon={faCog} /> Global
            </li>
          </a>
        </ul>
      </nav>
    </div>
  );
}

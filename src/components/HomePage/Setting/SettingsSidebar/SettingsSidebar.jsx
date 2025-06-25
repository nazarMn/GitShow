import React from 'react';
import './SettingsSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faFileLines,
  faBrain,
  faCog,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

export default function SettingsSidebar({ hasCV }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <div className="settings-sidebar">
      <nav>
        <ul>
          <a href="/PublicProfileSettings">
            <li className={isActive('/PublicProfileSettings') ? 'active' : ''}>
              <FontAwesomeIcon icon={faUser} /> Public profile
            </li>
          </a>
          <a href="/ResumeSettings">
            <li className={isActive('/ResumeSettings') ? 'active' : ''}>
              <FontAwesomeIcon icon={faFileLines} /> Resume
            </li>
          </a>
          <a href="/SkillsSettings">
            <li className={isActive('/SkillsSettings') ? 'active' : ''}>
              <FontAwesomeIcon icon={faBrain} /> Skills
            </li>
          </a>
          <a href="/CVModels">
            <li className={isActive('/CVModels') ? 'active' : ''}>
              <FontAwesomeIcon icon={faFileLines} /> CV
            </li>
          </a>
          {hasCV && (
            <a href="/CVEdit">
              <li className={isActive('/CVEdit') ? 'active' : ''}>
                <FontAwesomeIcon icon={faEdit} /> Edit CV
              </li>
            </a>
          )}
          <a href="/GlobalSettings">
            <li className={isActive('/GlobalSettings') ? 'active' : ''}>
              <FontAwesomeIcon icon={faCog} /> Global
            </li>
          </a>
        </ul>
      </nav>
    </div>
  );
}

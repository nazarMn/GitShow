import React, { useState, useEffect } from 'react'
import './SettingsSidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileLines, faBrain, faCog, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function SettingsSidebar() {
  const [hasCV, setHasCV] = useState(false);
  const location = useLocation(); 
  const currentPath = location.pathname;
  
  // Перевіряємо, чи має користувач CV при завантаженні компоненту
  useEffect(() => {
    const checkIfUserHasCV = async () => {
      try {
        const response = await axios.get('https://gitshow.onrender.com/api/cv/check');
        if (response.data && response.data.hasCV) {
          setHasCV(true);
        }
      } catch (error) {
        console.error('Error checking CV:', error);
      }
    };
    
    checkIfUserHasCV();
  }, []);

  // Функція для визначення, чи є пункт меню активним
  const isActive = (path) => {
    return currentPath === path;
  };

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
  )
}
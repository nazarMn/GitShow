import React, { useState, useEffect } from 'react'
import './SettingsSidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileLines, faBrain, faCog, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function SettingsSidebar() {
  const [hasCV, setHasCV] = useState(false);
  
  // Перевіряємо, чи має користувач CV при завантаженні компоненту
  useEffect(() => {
    const checkIfUserHasCV = async () => {
      try {
        const response = await axios.get('/api/cv/check');
        if (response.data && response.data.hasCV) {
          setHasCV(true);
        }
      } catch (error) {
        console.error('Error checking CV:', error);
      }
    };
    
    checkIfUserHasCV();
  }, []);

  return (
      <div className="settings-sidebar">
            <nav>
              <ul>
                <a href="/PublicProfileSettings">
                <li className="active">
                  <FontAwesomeIcon icon={faUser} /> Public profile
                </li>
                </a>
                <a href="/ResumeSettings">
                <li>
                  <FontAwesomeIcon icon={faFileLines} /> Resume
                </li>
                </a>
                <a href="/SkillsSettings">
                <li>
                  <FontAwesomeIcon icon={faBrain} /> Skills
                </li>
                </a>
                <a href="/CVModels">
                <li>
                  <FontAwesomeIcon icon={faFileLines} /> CV
                </li>
                </a>
                {hasCV && (
                  <a href="/CVEdit">
                  <li>
                    <FontAwesomeIcon icon={faEdit} /> Edit CV
                  </li>
                  </a>
                )}
                <a href="/GlobalSettings">
                <li>
                  <FontAwesomeIcon icon={faCog} /> Global
                </li>
                </a>
              </ul>
            </nav>
          </div>
  )
}
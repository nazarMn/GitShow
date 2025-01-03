import React from 'react'
import './SettingsSidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';

export default function SettingsSidebar() {
  return (
      <div className="settings-sidebar">
            <nav>
              <ul>
                <li className="active">
                  <FontAwesomeIcon icon={faUser} /> Public profile
                </li>
                <li>
                  <FontAwesomeIcon icon={faFileLines} /> Resume
                </li>
                <li>
                  <FontAwesomeIcon icon={faBrain} /> Skills
                </li>
              </ul>
            </nav>
          </div>
  )
}

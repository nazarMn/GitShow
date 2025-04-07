import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './DropdownMenu.css';

export default function DropdownMenu({ handleLogout }) {
  return (
    <div className="dropdownMenu">
      <a href="/PublicProfileSettings">
        <div className="menuItem">
          <FontAwesomeIcon icon={faCog} size="lg" color="#000" />
        </div>
      </a>
      <div className="menuItem" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="#000" />
      </div>
    </div>
  );
}

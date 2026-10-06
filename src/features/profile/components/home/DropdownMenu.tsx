import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { tw } from '@/shared/lib/tailwind';


interface DropdownMenuProps { handleLogout?: () => void; }

export default function DropdownMenu({ handleLogout }: DropdownMenuProps) {
  return (
    <div className={tw("dropdownMenu")}>
      <a href="/PublicProfileSettings">
        <div className={tw("menuItem")}>
          <FontAwesomeIcon icon={faCog} size="lg" color="#000" />
        </div>
      </a>
      <div className={tw("menuItem")} onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="#000" />
      </div>
    </div>
  );
}

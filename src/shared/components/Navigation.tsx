import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { useBookmarks } from "@/shared/hooks/useBookmarks";
import { tw } from '@/shared/lib/tailwind';


const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { data: bookmarks = [] } = useBookmarks();

  const toggleNavigation = () => setIsCollapsed((prev) => !prev);

  return (
    <div className={tw(`navigateContainer ${isCollapsed ? "collapsed" : ""}`)}>
      <button className={tw("toggleButton")} onClick={toggleNavigation}>
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} size="lg" color="#fff" />
      </button>
      <div className={tw(`navigateIcons ${isCollapsed ? "hidden" : ""}`)}>
        <Link to="/Project"><FontAwesomeIcon icon={faHouse} size="2x" color="#fff" /></Link>
        <Link to="/home"><FontAwesomeIcon icon={faUser} size="2x" color="#fff" /></Link>
        {bookmarks.length > 0 && (
          <Link to="/bookmarks"><FontAwesomeIcon icon={faBookmark} size="2x" color="#fff" /></Link>
        )}
      </div>
    </div>
  );
};

export default Navigation;

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";  

import "./NavigationСomponent.css";

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavigation = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <div className={`navigateContainer ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggleButton" onClick={toggleNavigation}>
        <FontAwesomeIcon
          icon={isCollapsed ? faChevronRight : faChevronLeft}
          size="lg"
          color="#fff"
        />
      </button>

      <div className={`navigateIcons ${isCollapsed ? "hidden" : ""}`}>
        <Link to="/Project">  
          <FontAwesomeIcon icon={faHouse} size="2x" color="#fff" />
        </Link>
        <Link to="/home">  
          <FontAwesomeIcon icon={faUser} size="2x" color="#fff" />
        </Link>
        <Link to="/portfolio">
          <FontAwesomeIcon icon={faBriefcase} size="2x" color="#fff" />
        </Link>
      </div>
    </div>
  );
};

export default Navigation;

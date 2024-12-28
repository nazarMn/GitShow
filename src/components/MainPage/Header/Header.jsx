import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="header">
      <div className="headerLeft">
        <h1>GitShow</h1>
      </div>
      <div className="headerMiddle"></div>
      <div className="headerRight">
        <div className="LangBox">
          <FontAwesomeIcon icon={faGlobe} size="lg" color="#15014b"  className='Icon' />
          <div className="select-wrapper">
            <select
              name=""
              id=""
              className="lang"
              onClick={toggleOpen}
              onBlur={() => setIsOpen(false)}
            >
              <option value="Eng">Eng</option>
              <option value="Ukr">Ukr</option>
              <option value="Deu">Deu</option>
              <option value="Ita">Ita</option>
            </select>
            <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
          </div>
        </div>
        <h2  className='Icon' >Support</h2>
        <FontAwesomeIcon
          icon={theme === 'light' ? faMoon : faSun}
          size="2xl"
          color="#15014b"
          cursor="pointer"
          onClick={toggleTheme}
          className='Icon' 
        />
        <FontAwesomeIcon icon={faGithub} size="2xl" color="#15014b" cursor="pointer"  className='Icon'  />
      </div>
    </div>
  );
}

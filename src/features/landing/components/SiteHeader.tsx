import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { tw } from '@/shared/lib/tailwind';


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={tw("header")}>
      <div className={tw("headerLeft")}>
        <h1>GitShow</h1>
      </div>
      <div className={tw("headerMiddle")}></div>
      <div className={tw("headerRight")}>
        <div className={tw("LangBox")}>
          <FontAwesomeIcon icon={faGlobe} size="lg" className={tw("Icon")} />
          <div className={tw("select-wrapper")}>
            <select
              name=""
              id=""
              className={tw("lang")}
              onClick={toggleOpen}
              onBlur={() => setIsOpen(false)}
            >
              <option value="Eng">Eng</option>
              <option value="Ukr">Ukr</option>
              <option value="Deu">Deu</option>
              <option value="Ita">Ita</option>
            </select>
            <span className={tw(`arrow ${isOpen ? 'open' : ''}`)}></span>
          </div>
        </div>
        <h2 className={tw("Icon max-sm:hidden")}>Support</h2>
        <FontAwesomeIcon
          icon={theme === 'light' ? faMoon : faSun}
          size="2xl"
          cursor="pointer"
          onClick={toggleTheme}
          className={tw("Icon")}
          aria-label="Toggle theme"
        />
        <FontAwesomeIcon
          icon={faGithub}
          size="2xl"
          cursor="pointer"
          onClick={() => window.open('https://github.com', '_blank')}
          className={tw("Icon")}
          aria-label="GitHub repository"
        />
      </div>
    </div>
  );
}

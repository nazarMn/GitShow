import React, { useState } from 'react';
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';


export default function Header() {


  
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOpen = () => {
      setIsOpen((prev) => !prev);
    };
  return (
    <div className='header'>
      <div className="headerLeft">
      <h1>GitShow</h1>
      </div>
      <div className="headerMiddle">
    


       
      </div>
      <div className="headerRight">
      <div className="LangBox">
      <FontAwesomeIcon icon={faGlobe} size="lg" color='#15014b' />
      <div className="select-wrapper">
        <select
          name=""
          id=""
          className="lang"
          onClick={toggleOpen}
          onBlur={() => setIsOpen(false)} // Закриваємо при втраті фокусу
        >
          <option value="Eng">Eng</option>
          <option value="Ukr">Ukr</option>
          <option value="Deu">Deu</option>
          <option value="Ita">Ita</option>
        </select>
        <span className={`arrow ${isOpen ? "open" : ""}`}></span>
      </div>
    </div>
    <h2>Support</h2>
      
      <FontAwesomeIcon icon={faMoon} size="2xl" color='#15014b' cursor={'pointer'} />
      <FontAwesomeIcon icon={faGithub} size="2xl" color='#15014b' cursor={'pointer'} />
        
      </div>

      
    </div>
  )
}

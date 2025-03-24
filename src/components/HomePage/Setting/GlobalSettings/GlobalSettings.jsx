import React from 'react'
import './GlobalSettings.css'
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function GlobalSettings() {

  const handleGoHome = () => {
    window.location.href = '/home'; // Перенаправлення на сторінку home
  };
  return (
    <div className='GlobalSettings'>

      <SettingsSidebar />

      <div className="GlobalSettings-Content">

      <div className="GlobalSettings-Main">
        <h1>Global settings</h1>
        </div>

          <FontAwesomeIcon icon={faTimes} className="btn-go-home" onClick={handleGoHome}/> 

      </div>
      
    </div>
  )
}

import React from 'react'
import './CVSettings.css'
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";

export default function CVSettings() {

  return (
    <div className="CV-Settings">
            <SettingsSidebar />
            <div className="CV-Create-container">
              <a href="CVModels">
      <button className="create-btn">Create CV</button>
      </a>
      </div>
    </div>
  )
}

import React from 'react'
import './CVAISettings.css'
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";

export default function CVAISettings() {

  return (
    <div className="CV-AI-Settings">
            <SettingsSidebar />
            <div className="CV-Generate-container">
              <a href="CVAIModels">
      <button className="generate-btn">Generate CV</button>
      </a>
      </div>
    </div>
  )
}

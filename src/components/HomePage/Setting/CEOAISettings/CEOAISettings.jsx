import React from 'react'
import './CEOAISettings.css'
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";

export default function CEOAISettings() {

  return (
    <div className="CEO-AI-Settings">
            <SettingsSidebar />
            <div className="CEO-Generate-container">
              <a href="CEOAIModels">
      <button className="generate-btn">Generate CEO</button>
      </a>
      </div>
    </div>
  )
}

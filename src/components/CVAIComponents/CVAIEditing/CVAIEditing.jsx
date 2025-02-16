import React from 'react';
import './CVAIEditing.css';


export default function CVAIEditing() {
  return (
    <div className="CV-AI-Editing"> 
      <header className="CV-AI-Editing-header">
        <div className="CV-AI-Editing-header-Left">
          <img src="" alt="" />
        </div>

        <div className="CV-AI-Editing-header-Right">
          <h2>Name</h2>
          <p>CV</p>
          
        </div>
        <div className="triangle"></div>
      </header>

      <div className="CV-AI-Editing-Container">
        <div className="CV-AI-Editing-Container-Left"></div>

        <div className="CV-AI-Editing-Container-Right"></div>
      </div>     
    </div>
  );
}
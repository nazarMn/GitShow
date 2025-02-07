import React from 'react';
import './CEOAIEditing.css';


export default function CEOAIEditing() {
  return (
    <div className="CEO-AI-Editing"> 
      <header className="CEO-AI-Editing-header">
        <div className="CEO-AI-Editing-header-Left">
          <img src="" alt="" />
        </div>

        <div className="CEO-AI-Editing-header-Right">
          <h2>Name</h2>
          <p>CEO</p>
          
        </div>
        <div className="triangle"></div>
      </header>

      <div className="CEO-AI-Editing-Container">
        <div className="CEO-AI-Editing-Container-Left"></div>

        <div className="CEO-AI-Editing-Container-Right"></div>
      </div>     
    </div>
  );
}
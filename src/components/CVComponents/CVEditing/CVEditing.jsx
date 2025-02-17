import React from 'react';
import './CVEditing.css';


export default function CVAIEditing() {
  return (
    <div className="CV-Editing"> 
      <header className="CV-Editing-header">
        <div className="CV-Editing-header-Left">
          <img src="" alt="" />
        </div>

        <div className="CV-Editing-header-Right">
          <h2>Name</h2>
          <p>CV</p>
          
        </div>
        <div className="triangle"></div>
      </header>

      <div className="CV-Editing-Container">
        <div className="CV-Editing-Container-Left"></div>

        <div className="CV-Editing-Container-Right"></div>
      </div>     
    </div>
  );
}
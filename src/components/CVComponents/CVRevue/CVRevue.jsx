
import React from 'react';
import './CVRevue.css';


export default function CVRevue() {
  return (
    <div className="CV-Revue"> 
      <header className="CV-Revue-header">
        <div className="CV-Editing-header-Left">
          <img src="" alt="" />
        </div>

        <div className="CV-Revue-header-Right">
          <h2>Name</h2>
          <p>CV</p>
          
        </div>
        <div className="triangle"></div>
      </header>

      <div className="CV-Revue-Container">
        <div className="CV-Revue-Container-Left"></div>

        <div className="CV-Revue-Container-Right"></div>
      </div>     
    </div>
  );
}
import React from 'react';
import './CVRevue.css';

export default function CVRevue() {
  return (
    <div className="CV-Revue"> 
      <header className="CV-Revue-header">
        <div className="CV-Revue-header-Left">
          <img src="https://avatars.githubusercontent.com/u/69341802?v=4" alt="Profile" className="profile-img" />
        </div>

        <div className="CV-Revue-header-Right">
          <h2>Name</h2>
          <p>IT</p>
        </div>
        <div className="triangle"></div>
      </header>

      <div className="CV-Revue-Container">
        <div className="CV-Revue-Container-Left">
          <div className="Contact-Сontainer">
            <div className="Contact-Email">Email</div>
            <div className="Contact-Phone">Phone</div>
            <div className="Contact-Adress">Adress</div>

          </div>
          <div className="Education-Container">

          </div>
          <div className="Skills-Container">

          </div>

        </div>
        <div className="CV-Revue-Container-Right">
          <div className="Summary-Container">
            
          </div>
          <div className="Experience-Container">
          </div>
          <div className="Reference-Container">
            
          </div>
          

        </div>
      </div>     
    </div>
  );
}

import React from 'react';
import './CVRevue.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone,faLocationDot } from "@fortawesome/free-solid-svg-icons";
<FontAwesomeIcon icon="fa-solid fa-envelope" />
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
            <div className="Contact-Email"> <FontAwesomeIcon icon={faEnvelope}  size="xl" /> <h2>Email</h2></div>
            <div className="Contact-Phone"> <FontAwesomeIcon icon={faPhone}  size="xl" /> <h2>Phone</h2></div>
            <div className="Contact-Adress"><FontAwesomeIcon icon={faLocationDot}  size="xl" /> <h2>Adress</h2></div>

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

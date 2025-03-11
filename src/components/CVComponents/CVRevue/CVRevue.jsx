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
    <h2 className="Section-Title">Contact Details</h2>
    <div className="Contact-Item">
      <FontAwesomeIcon icon={faEnvelope} />
      <span>earnerayan@gmail.com</span>
    </div>
    <div className="Contact-Item">
      <FontAwesomeIcon icon={faPhone} />
      <span>(125) 229 0621</span>
    </div>
    <div className="Contact-Item">
      <FontAwesomeIcon icon={faLocationDot} />
      <span>North Bridie, 05269, New Hampshire</span>
    </div>
  </div>

  
  <div className="Education-Container">
    <h2 className="Section-Title">Education</h2>
    <div className="Education-Content">
      <div className="Education-Details">
        <h3 className="Education-Degree">Bachelor of Science in Computer Science</h3>
        <p className="Education-University">University of California, Berkeley</p>
        <p className="Education-Year">2017 - 2021</p>
      </div>
    </div>
  </div>

 
  <div className="Skills-Container">
    <h2 className="Section-Title">Skills</h2>
    <ul className="Skills-List">
      <li>Technical Skills - Expert</li>
      <li>Troubleshooting - Expert</li>
      <li>Networking - Expert</li>
      <li>Systems Administration - Expert</li>
      <li>Database Management - Expert</li>
      <li>Security Protocols - Expert</li>
    </ul>
  </div>
</div>


<div className="CV-Revue-Container-Right">
      <div className="Summary-Container">
        <header className="Summary-Title">Summary</header>
        <p>
          IT Specialist with 6+ years of experience in troubleshooting and
          maintaining computer systems. Skilled in implementing new technology
          and providing technical support to end users.
          IT Specialist with 6+ years of experience in troubleshooting and
          maintaining computer systems. Skilled in implementing new technology
          and providing technical support to end users.
          IT Specialist with 6+ years of experience in troubleshooting and
          maintaining computer systems. Skilled in implementing new technology
          and providing technical support to end users.
        </p>
      </div>
      <div className="Experience-Container">
        <header className="Experience-Title">Work Experience</header>
        <div className="Experience-Item">
          <h3>IT Specialist, Google</h3>
          <p className="Experience-Date">March 2023 - Present</p>
          <ul>
            <li>
              Successfully designed and implemented a new database system for a
              large international company, resulting in increased efficiency
              and productivity.
            </li>
            <li>
              Developed and maintained network infrastructure for a financial
              services organization, resulting in improved security and
              reliability.
            </li>
            <li>
              Utilized advanced technologies such as Linux, Apache, Windows
              Server, and MySQL to create complex web-based applications.
            </li>
          </ul>
        </div>
        <div className="Experience-Item">
          <h3>IT Specialist, Google</h3>
          <p className="Experience-Date">May 2021 - February 2023</p>
          <ul>
            <li>
              Managed a team of IT professionals responsible for the
              maintenance and development of corporate networks and systems.
            </li>
            <li>
              Installed and configured hardware and software, including
              servers, printers, routers, and switches.
            </li>
            <li>
              Developed an innovative and secure system for data storage and
              retrieval.
            </li>
          </ul>
        </div>
      </div>
      <div className="Reference-Container">
        <header className="Reference-Title">References</header>
        <p>References available upon request</p>
      </div>
    </div>
      </div>     
    </div>
  );
}

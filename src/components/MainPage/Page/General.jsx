import React, { useState } from 'react';
import './General.css';
import TypeIt from 'typeit-react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGitlab, faGitkraken, faBitbucket } from "@fortawesome/free-brands-svg-icons";

export default function General() {
  const texts = ['Create A Portfolio', 'Share Projects', 'Get To Know Other Developers', 'View Projects'];


    const [isOpen, setIsOpen] = useState(false);
  
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

  return (
    <div className="general">
      <div className="generalTop">
        <h2>GITHUB PORTFOLIO</h2>
      </div>
      <div className="generalMiddle">
        <h2>
          Loved by developers. <br />
          You Can{' '}
          <span className="gradient-text">
            <TypeIt
              options={{
                strings: texts,
                loop: true,
                breakLines: false,
                speed: 100,
                deleteSpeed: 50,
              }}
            />
          </span>
        </h2>
      </div>
      <div className="generalBottom">
        <div className="generalBottomTittle">
          <h2>
            GitShow is a platform for creating portfolios and connecting with developers. Showcase your
            projects, <br /> share your experience, and network in a user-friendly format.
          </h2>
        </div>
        <div className="generalBottomButton">
          
            <button onClick={openModal}>Get Started</button>
        
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
          
          },
        }}
      >
        <div className="modal-general">
          <header className="modal-general-header">

            <h2>Join GitShow</h2>

           <button><FontAwesomeIcon icon={faTimes} size="lg" onClick={closeModal} /></button> 

          </header>

          <div className="modal-general-body">

            <h2>Choose how you'd to create your account:</h2>

          <ul>
          <a href="/auth/github" className="auth-link">
  <li className="active">
    <FontAwesomeIcon icon={faGithub} size="2xl" />
    Continue with GitHub
  </li>
</a>

            <li style={{ backgroundColor: '#FC6D26', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', cursor: 'not-allowed' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FontAwesomeIcon icon={faGitlab} size="2xl" />
    Continue with GitLab
  </div>
  <span style={{ fontSize: '16px', opacity: 0.7 }}>Coming Soon</span>
</li>

            <li style={{ backgroundColor: '#179287', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', cursor: 'not-allowed' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FontAwesomeIcon icon={faGitkraken} size="2xl" />
    Continue with GitKraken
  </div>
  <span style={{ fontSize: '16px', opacity: 0.7 }}>Coming Soon</span>
</li>

          <li style={{ backgroundColor: '#0052CC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', cursor: 'not-allowed' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <FontAwesomeIcon icon={faBitbucket} size="2xl" />
    Continue with Bitbucket
  </div>
  <span style={{ fontSize: '16px', opacity: 0.7 }}>Coming Soon</span>
</li>

           
          </ul>


          </div>

        </div>

        <div className="modal-general-policy">

          <h2>By joining, you agree to GitShow's <span>Terms of Service</span> and  <span>Privacy Policy</span></h2>

        </div>
      </Modal>
    </div>
  );
}

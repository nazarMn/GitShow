import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  
import React, { useState, useEffect } from 'react';
import './CVModels.css';
import CV1 from '/CV1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons'; 
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SettingsSidebar from '../../HomePage/Setting/SettingsSidebar/SettingsSidebar';

const CV_IMAGES = [{ id: 'CV1', src: CV1 }];

export default function CVModels() {
  const [selectedCV, setSelectedCV] = useState(null);
  const [hasCV, setHasCV] = useState(false);
  const [userData, setUserData] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const checkIfUserHasCV = async () => {
      try {
        const response = await fetch('/api/cv/check');
        if (response.ok) {
          const data = await response.json();
          setHasCV(data.hasCV);
          
          if (data.hasCV) {
            fetchShareLink();
          }
        }
      } catch (error) {
        console.error('Error checking CV:', error);
      }
    };
    
    const fetchShareLink = async () => {
      try {
        const response = await fetch('/api/cv/sharelink');
        if (response.ok) {
          const data = await response.json();
          const baseUrl = window.location.origin;
          setShareLink(`${baseUrl}/shared-cv/${data.shareableLink}`);
        }
      } catch (error) {
        console.error('Error fetching share link:', error);
      }
    };

    fetchUserData();
    checkIfUserHasCV();
  }, []);
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleSelect = (id) => {
    setSelectedCV(prevSelected => (prevSelected === id ? null : id));
  };

  const handleSaveCV = async () => {
  if (!selectedCV) {
    toast.warn('Please select a CV template');
    return;
  }

  if (hasCV) {
    toast.error('You already have a saved CV.');
    return;
  }

  if (!userData) {
    toast.error('User data is missing.');
    return;
  }

  try {
    const response = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: selectedCV,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        email: userData.email,
        location: userData.location,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('CV saved successfully!');
      setHasCV(true); 

      if (data.shareableLink) {
        const baseUrl = window.location.origin;
        setShareLink(`${baseUrl}/shared-cv/${data.shareableLink}`);
      }
    } else {
      toast.error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error saving CV:', error);
    toast.error('Failed to save CV');
  }
};


const confirmDelete = async (toastId) => {
  try {
    const response = await fetch('/api/cv/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (response.ok) {
      toast.dismiss(toastId);
      toast.success('CV deleted successfully!');
      setHasCV(false);    
      setShareLink('');
      setSelectedCV(null); 
    } else {
      toast.error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error deleting CV:', error);
    toast.error('Failed to delete CV');
  }
};


  const handleDeleteCV = () => {
  const toastId = toast.info(
    <div>
      <p>Are you sure you want to delete your CV?</p>
      <button
        onClick={() => confirmDelete(toastId)}
        className="btn-confirm"
      >
        Yes
      </button>
      <button onClick={() => toast.dismiss(toastId)} className="btn-cancel">
        No
      </button>
    </div>,
    { position: 'top-center', autoClose: false, closeOnClick: false }
  );
};



  const handleGoHome = () => {
    window.location.href = '/home';
  };
  
  return (

    <div className="CV-Models">
   <SettingsSidebar hasCV={hasCV} />

      
<div className="CV-Models-Content">

      <header className="CV-Models-header">Choose your CV design</header>
      <div className="CV-Models-Container">
        {CV_IMAGES.map((image) => (
          <div key={image.id} className="CV-Slide" onClick={() => handleSelect(image.id)}>
            <img
              src={image.src}
              alt={`CV Model ${image.id}`}
              className={`CV-Image ${selectedCV === image.id ? 'selected' : ''}`}
            />
          </div>
        ))}
      </div>

      {hasCV && (
        <div className="CV-Models-Message success">
          <p>You already have a saved CV.</p>
          <button onClick={handleDeleteCV} className="delete-btn">
            <FontAwesomeIcon icon={faTrashAlt} />
            Delete CV
          </button>
          
          {shareLink && (
            <div className="CV-Share-Box">
              <p>Share your CV with this link:</p>
              <div className="Share-Link-Container">
              <input
  type="text"
  value={shareLink}
  readOnly
  className="Share-Link-Input"
  onClick={() => window.open(shareLink, '_blank')}
/>

                <button 
                  onClick={copyShareLink} 
                  className="Copy-Link-Button"
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={faCopy} />
                  {linkCopied ? ' Copied!' : ' Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!hasCV && selectedCV && (
        <div className="CV-Models-Save">
         <button onClick={() => handleSaveCV()}>Continue</button>

        </div>
      )}

      <ToastContainer />

         <FontAwesomeIcon icon={faTimes} className="btn-go-home" onClick={handleGoHome}/> 
      </div>
    </div>
  );
}
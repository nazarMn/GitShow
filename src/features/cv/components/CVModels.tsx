import { toast, type Id } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CV1 from '@/assets/cv-template.png';
import type { UserProfile } from '@/shared/types/domain';
import type { ApiMessageResponse, CvCheckResponse, CvMutationResponse, CvShareLinkResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import SettingsSidebar from "@/features/settings/components/SettingsSidebar";
import { tw } from '@/shared/lib/tailwind';


const CV_IMAGES = [{ id: 'CV1', src: CV1 }];

export default function CVModels() {
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [hasCV, setHasCV] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await readJson<UserProfile>(response);
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
          const data = await readJson<CvCheckResponse>(response);
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
          const data = await readJson<CvShareLinkResponse>(response);
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

  const handleSelect = (id: string) => {
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

    const data = await readJson<CvMutationResponse>(response);
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


const confirmDelete = async (toastId: Id) => {
  try {
    const response = await fetch('/api/cv/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await readJson<ApiMessageResponse>(response);
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
        className={tw("btn-confirm")}
      >
        Yes
      </button>
      <button onClick={() => toast.dismiss(toastId)} className={tw("btn-cancel")}>
        No
      </button>
    </div>,
    { position: 'top-center', autoClose: false, closeOnClick: false }
  );
};



  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (

    <div className={tw("CV-Models")}>
   <SettingsSidebar hasCV={hasCV} />


<div className={tw("CV-Models-Content")}>

      <header className={tw("CV-Models-header")}>Choose your CV design</header>
      <div className={tw("CV-Models-Container")}>
        {CV_IMAGES.map((image) => (
          <div key={image.id} className={tw("CV-Slide")} onClick={() => handleSelect(image.id)}>
            <img
              src={image.src}
              alt={`CV Model ${image.id}`}
              className={tw(`CV-Image ${selectedCV === image.id ? 'selected' : ''}`)}
            />
          </div>
        ))}
      </div>

      {hasCV && (
        <div className={tw("CV-Models-Message success")}>
          <p>You already have a saved CV.</p>
          <button onClick={handleDeleteCV} className={tw("delete-btn")}>
            <FontAwesomeIcon icon={faTrashAlt} />
            Delete CV
          </button>

          {shareLink && (
            <div className={tw("CV-Share-Box")}>
              <p>Share your CV with this link:</p>
              <div className={tw("Share-Link-Container")}>
              <input
  type="text"
  value={shareLink}
  readOnly
  className={tw("Share-Link-Input")}
  onClick={() => window.open(shareLink, '_blank')}
/>

                <button
                  onClick={copyShareLink}
                  className={tw("Copy-Link-Button")}
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
        <div className={tw("CV-Models-Save")}>
         <button onClick={() => handleSaveCV()}>Continue</button>

        </div>
      )}

      <FontAwesomeIcon icon={faTimes} className={tw("btn-go-home")} onClick={handleGoHome}/>
      </div>
    </div>
  );
}

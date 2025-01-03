import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faLink, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    company: '',
    location: '',
    email: '',
    instagram: '',
    twitter: '',
    facebook: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          company: data.company || '',
          location: data.location || '',
          email: data.email || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
          facebook: data.facebook || '',
        });
      })
      .catch(() => setUser(null));
  }, []);

  const validateField = (id, value) => {
    let error = '';

    if (id === 'instagram' && value) {
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
      if (!instagramRegex.test(value)) {
        error = 'Please enter a valid Instagram URL.';
      }
    }

    if (id === 'twitter' && value) {
      const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
      if (!twitterRegex.test(value)) {
        error = 'Please enter a valid Twitter URL.';
      }
    }

    if (id === 'facebook' && value) {
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;
      if (!facebookRegex.test(value)) {
        error = 'Please enter a valid Facebook URL.';
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    validateField(id, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      alert('Please fix the errors before submitting.');
      return;
    }

    fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUser(updatedUser);
        alert('Profile updated successfully!');
      })
      .catch((err) => alert('Error updating profile'));
  };

  return (
    <div className="account-settings">


      <SettingsSidebar />




      <div className="settings-content">
        <div className="settings-main">
          <h1>Public profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your Company"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where are you from"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="social-accounts">Social accounts</label>
              <div className="social-input">
                <FontAwesomeIcon icon={faLink} />
                <input
                  type="url"
                  id="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="Your Instagram"
                />
                {errors.instagram && <p className="error">{errors.instagram}</p>}
              </div>
              <div className="social-input">
                <FontAwesomeIcon icon={faLink} />
                <input
                  type="url"
                  id="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="Your Twitter"
                />
                {errors.twitter && <p className="error">{errors.twitter}</p>}
              </div>
              <div className="social-input">
                <FontAwesomeIcon icon={faLink} />
                <input
                  type="url"
                  id="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="Your Facebook"
                />
                {errors.facebook && <p className="error">{errors.facebook}</p>}
              </div>
            </div>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </form>
        </div>
        <div className="profile-picture-wrapper">
          {user && user.avatarUrl ? (
            <div className="profile-picture">
              <img src={user.avatarUrl} alt="Profile" />
              <button className="btn-edit-photo">
                <FontAwesomeIcon icon={faPencil} /> Edit Photo
              </button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

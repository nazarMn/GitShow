import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faLink, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';


export default function AccountSettings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="account-settings">
      <div className="settings-sidebar">
        <nav>
          <ul>
            <li className="active">
              <FontAwesomeIcon icon={faUser} /> Public profile
            </li>
            <li>
              <FontAwesomeIcon icon={faFileLines} /> Resume
            </li>
            <li>
              <FontAwesomeIcon icon={faBrain} /> Skills
            </li>
          </ul>
        </nav>
      </div>
      <div className="settings-content">
        <div className="settings-main">
          <h1>Public profile</h1>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" placeholder="Tell us about yourself"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="Location">Location</label>
              <input type='text' id="Location" placeholder="Where are you from"/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="your email"/>
            </div>
            <div className="form-group">
  <label htmlFor="social-accounts">Social accounts</label>
  <div className="social-input">
    <FontAwesomeIcon icon={faLink} />
    <input type="url" id="instagram" placeholder="Your Instagram" />
  </div>
  <div className="social-input">
    <FontAwesomeIcon icon={faLink} />
    <input type="url" id="twitter" placeholder="Your Twitter" />
  </div>
  <div className="social-input">
    <FontAwesomeIcon icon={faLink} />
    <input type="url" id="facebook" placeholder="Your Facebook" />
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

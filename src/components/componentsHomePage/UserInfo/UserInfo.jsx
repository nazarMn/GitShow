import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faBuilding, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './UserInfo.css';

export default function UserInfo({ user }) {
  return (
    <div className="homeBottomRight">
      <img src={user.avatarUrl} alt="avatar" />
      <h2>{user.username}</h2>
      <p>{user.bio}</p>
      {user.location && (
        <div className="infoGroup">
          <FontAwesomeIcon icon={faLocationDot} size="lg" color="#fff" />
          <p>{user.location}</p>
        </div>
      )}
      {user.company && (
        <div className="infoGroup">
          <FontAwesomeIcon icon={faBuilding} size="lg" color="#fff" />
          <p>{user.company}</p>
        </div>
      )}
      {user.email && (
        <div className="infoGroup">
          <FontAwesomeIcon icon={faEnvelope} size="lg" color="#fff" />
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}

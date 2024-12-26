import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faCog, faSignOutAlt, faLocationDot, faBuilding, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        console.log('User data:', data); // Додано консоль для перевірки
        setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home">
      <div className="socialIcons">
        {user.profileUrl && (
          <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} size="2x" color="#fff" />
          </a>
        )}
        {user.instagram && (
          <a href={user.instagram} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" color="#fff" />
          </a>
        )}
        {user.facebook && (
          <a href={user.facebook} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" color="#fff" />
          </a>
        )}
        {user.twitter && (
          <a href={user.twitter} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" color="#fff" />
          </a>
        )}
      </div>
      <div className="homeTop">
        <div className="menuWrapper">
          <FontAwesomeIcon
            icon={faBars}
            size="2xl"
            color="#fff"
            cursor="pointer"
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className="dropdownMenu">
              <div className="menuItem" onClick={() => alert('Open settings')}>
                <FontAwesomeIcon icon={faCog} size="lg" color="#000" />
              </div>
              <div className="menuItem" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="#000" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="homeBottom">
        <div className="homeBottomLeft">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
        <div className="homeBottomRight">
          <img src={user.avatarUrl} alt="avatar" />
          <h2>{user.username}</h2>
          {user.location && (
            <div className="infoGroup">
              <FontAwesomeIcon icon={faLocationDot} size="lg" color="#fff" />{' '}
              <p>{user.location}</p>
            </div>
          )}
          {user.company && (
            <div className="infoGroup">
              <FontAwesomeIcon icon={faBuilding} size="lg" color="#fff" />{' '}
              <p>{user.company}</p>
            </div>
          )}
          {user.email && (
            <div className="infoGroup">
              <FontAwesomeIcon icon={faEnvelope} size="lg" color="#fff" />{' '}
              <p>{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

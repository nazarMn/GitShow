import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
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
          <div className="from">
            <FontAwesomeIcon icon={faLocationDot} size="lg" color="#fff" />{' '}
            <p>{user.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

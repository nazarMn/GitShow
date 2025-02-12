import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faCog, faSignOutAlt, faLocationDot, faBuilding, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        console.log('User data:', data);
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
              <a href="/PublicProfileSettings">
                <div className="menuItem">
                  <FontAwesomeIcon icon={faCog} size="lg" color="#000" />
                </div>
              </a>
              <div className="menuItem" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="#000" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="homeBottom">
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
        
        <div className="homeBottomLeft">
          <h2>{user.name}</h2>
          <div className="contributionsChart">
            <h3>Статистика активності</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={user.contributions}>
                <XAxis dataKey="date" stroke="#ccc" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} strokeWidth={2} width={"100%"} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

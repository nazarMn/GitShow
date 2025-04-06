import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faCog, faSignOutAlt, faLocationDot, faBuilding, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area} from "recharts";

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
    <AreaChart 
      data={user.contributions} 
      margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
    >
      <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.9} />
          <stop offset="50%" stopColor="#82ca9d" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#82ca9d" stopOpacity={0.1} />
        </linearGradient>
      </defs>

      <XAxis dataKey="date" stroke="#ccc" />
      <YAxis domain={[0, 'dataMax + 3']} stroke="#ccc" />
      <Tooltip />
      <Area 
        type="natural" 
        dataKey="count" 
        stroke="#82ca9d" 
        strokeOpacity={0.8} 
        fill="url(#colorGradient)" 
        fillOpacity={1} 
        strokeWidth={2} 
        dot={false}  
        activeDot={{ r: 6, fill: "#82ca9d", stroke: "#fff", strokeWidth: 2 }}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

<div className="followsContainer">

<div className="followsCard">
  <h4>Following</h4>
  <div className="followsInfo">
    <h3>0</h3>
    <p>View all</p>
  </div>
</div>

<div className="followsCard">
  <h4>Followers</h4>
  <div className="followsInfo">
    <h3>0</h3>
    <p>View all</p>
  </div>
</div>


</div>



        </div>
      </div>
    </div>
  );
}

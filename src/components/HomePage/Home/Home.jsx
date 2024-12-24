import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faP } from '@fortawesome/free-solid-svg-icons';
import {faPen} from '@fortawesome/free-solid-svg-icons'
import {faLocationDot} from '@fortawesome/free-solid-svg-icons'
import './Home.css';
export default function Home() {
  const [user, setUser] = useState(null);

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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home">
      <div className="homeTop">
        <FontAwesomeIcon icon={faBars} size="2xl" color='#fff' cursor={'pointer'} />
        


      </div>
      <div className="homeBottom">
        <div className="homeBottomLeft">
        <h2> {user.name} </h2>
        <p> {user.bio}</p>

        </div>
        <div className="homeBottomRight">
        <img src={user.avatarUrl} alt="avatar" />
        <h2>{user.username}</h2>
        <div className="from"><FontAwesomeIcon icon={faLocationDot} size="lg" color='#fff' /> <p> {user.location}</p> </div>

        </div>
        
      </div>
      {/* <h2> {user.username}!</h2>
      
      <p>
        View your profile on <a href={user.profileUrl}>GitHub</a>
      </p>
      <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}

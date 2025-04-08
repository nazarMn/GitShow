import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import UserInfo from '../../../componentsHomePage/UserInfo/UserInfo';
import SocialIcons from '../../../componentsHomePage/SocialIcons/SocialIcons';
import ContributionsChart from '../../../componentsHomePage/ContributionChart/ContributionChart';
import FollowsCard from '../../../componentsHomePage/FollowsCard/FollowsCard';
import DropdownMenu from '../../../componentsHomePage/DropdownMenu/DropdownMenu';

export default function PublicHome() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  if (!user) return <p>Loading...</p>;

  

  return (
     <div className="home">
       <SocialIcons user={user} />
 
       <div className="homeTop">
         <div className="menuWrapper">
           <FontAwesomeIcon icon={faBars} size="2xl" color="#fff" cursor="pointer" onClick={toggleMenu} />
           {menuOpen && <DropdownMenu handleLogout={handleLogout} />}
         </div>
       </div>
 
       <div className="homeBottom">
       <UserInfo user={user} showFollowMessage={true} />
 
         <div className="homeBottomLeft">
           <h2>{user.name}</h2>
           <ContributionsChart contributions={user.contributions} />
           <FollowsCard />
         </div>
       </div>
     </div>
  );
} 
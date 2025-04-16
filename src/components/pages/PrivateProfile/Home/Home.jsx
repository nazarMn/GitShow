import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserInfo from '../../../componentsProfilePage/BoxHomePage/UserInfo/UserInfo';
import SocialIcons from '../../../componentsProfilePage/BoxHomePage/SocialIcons/SocialIcons';
import ContributionsChart from '../../../componentsProfilePage/BoxHomePage/ContributionChart/ContributionChart';
import FollowsCard from '../../../componentsProfilePage/BoxHomePage/FollowsCard/FollowsCard';
import DropdownMenu from '../../../componentsProfilePage/BoxHomePage/DropdownMenu/DropdownMenu';
import FollowInfoModal from '../../../componentsProfilePage/BoxHomePage/FollowInfoModal/FollowInfoModal';

import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'followers' or 'following'

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleViewAll = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home">
      <SocialIcons user={user} />

      <div className="homeTop">
        <div className="menuWrapper">
          <FontAwesomeIcon icon={faBars} size="2xl" color="#fff" cursor="pointer" onClick={toggleMenu} />
          {menuOpen && <DropdownMenu handleLogout={() => (window.location.href = '/logout')} />}
        </div>
      </div>

      <div className="homeBottom">
        <UserInfo user={user} showFollowMessage={false} />
        <div className="homeBottomLeft">
          <h2>{user.name}</h2>
          <ContributionsChart contributions={user.contributions} />
          <FollowsCard user={user} onViewAll={handleViewAll} />
        </div>
      </div>

      <FollowInfoModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        type={modalType}
        data={modalType === 'followers' ? user.followers : user.following}
      />
    </div>
  );
}

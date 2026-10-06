import React, { useEffect, useState } from 'react';
import type { FollowListType, UserProfile } from '@/shared/types/domain';
import { readJson } from '@/shared/lib/http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserInfo from "@/features/profile/components/home/UserInfo";
import SocialIcons from "@/features/profile/components/home/SocialIcons";
import ContributionsChart from "@/features/profile/components/home/ContributionChart";
import FollowsCard from "@/features/profile/components/home/FollowsCard";
import DropdownMenu from "@/features/profile/components/home/DropdownMenu";
import FollowInfoModal from "@/features/profile/components/home/FollowInfoModal";
import { tw } from '@/shared/lib/tailwind';



export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FollowListType | ''>(''); // 'followers' or 'following'

  useEffect(() => {
    fetch('/api/user')
      .then((res) => readJson<UserProfile>(res))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleViewAll = (type: FollowListType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className={tw("home")}>
      <SocialIcons user={user} />

      <div className={tw("homeTop")}>
        <div className={tw("menuWrapper")}>
          <FontAwesomeIcon icon={faBars} size="2xl" color="#fff" cursor="pointer" onClick={toggleMenu} />
          {menuOpen && <DropdownMenu handleLogout={() => (window.location.href = '/logout')} />}
        </div>
      </div>

      <div className={tw("homeBottom")}>
        <UserInfo user={user} showFollowMessage={false} />
        <div className={tw("homeBottomLeft")}>
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

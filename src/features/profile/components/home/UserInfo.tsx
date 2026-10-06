import React from 'react';
import type { UserProfile } from '@/shared/types/domain';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faBuilding, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import FollowMessage from "@/features/profile/components/home/FollowMessage";
import { tw } from '@/shared/lib/tailwind';


interface UserInfoProps { user: UserProfile; showFollowMessage?: boolean; }

export default function UserInfo({ user, showFollowMessage = false }: UserInfoProps) {
  return (
    <div className={tw("homeBottomRight")}>
      <img src={user.avatarUrl} alt="avatar" />
      <h2>{user.username}</h2>

      {showFollowMessage && <FollowMessage user={user} />}

      <p>{user.bio}</p>

      {user.location && (
        <div className={tw("infoGroup")}>
          <FontAwesomeIcon icon={faLocationDot} size="lg" color="#fff" />
          <p>{user.location}</p>
        </div>
      )}
      {user.company && (
        <div className={tw("infoGroup")}>
          <FontAwesomeIcon icon={faBuilding} size="lg" color="#fff" />
          <p>{user.company}</p>
        </div>
      )}
      {user.email && (
        <div className={tw("infoGroup")}>
          <FontAwesomeIcon icon={faEnvelope} size="lg" color="#fff" />
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}

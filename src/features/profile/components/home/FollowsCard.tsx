import React from 'react';
import type { FollowListType, UserProfile } from '@/shared/types/domain';
import { tw } from '@/shared/lib/tailwind';


interface FollowsCardProps { user: UserProfile; onViewAll: (type: FollowListType) => void; }

export default function FollowsCard({ user, onViewAll }: FollowsCardProps) {
  return (
    <div className={tw("followsContainer")}>
      <div className={tw("followsCard")}>
        <h4>Following</h4>
        <div className={tw("followsInfo")}>
          <h3>{user.following?.length || 0}</h3>
          <p onClick={() => onViewAll('following')}>View all</p>
        </div>
      </div>

      <div className={tw("followsCard")}>
        <h4>Followers</h4>
        <div className={tw("followsInfo")}>
          <h3>{user.followers?.length || 0}</h3>
          <p onClick={() => onViewAll('followers')}>View all</p>
        </div>
      </div>
    </div>
  );
}

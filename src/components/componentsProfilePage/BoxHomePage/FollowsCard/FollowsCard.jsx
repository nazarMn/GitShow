import React from 'react';
import './FollowsCard.css';

export default function FollowsCard({ user }) {
  return (
    <div className="followsContainer">
      <div className="followsCard">
        <h4>Following</h4>
        <div className="followsInfo">
          <h3>{user.following?.length || 0}</h3>
          <p>View all</p>
        </div>
      </div>

      <div className="followsCard">
        <h4>Followers</h4>
        <div className="followsInfo">
          <h3>{user.followers?.length || 0}</h3>
          <p>View all</p>
        </div>
      </div>
    </div>
  );
}

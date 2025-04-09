import React, { useState } from 'react';

import './FollowMessage.css';

export default function FollowMessage() {

    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = () => {
      setIsFollowing(true);
      // тут можна викликати API для підписки
    };
  
    const handleUnfollow = () => {
      setIsFollowing(false);
      // тут можна викликати API для відписки
    };

  return (
    <div className="follow-message">
    {!isFollowing ? (
      <button className="follow-btn" onClick={handleFollow}>
        Follow
      </button>
    ) : (
      <div className="button-group">
        <button className="unfollow-btn" onClick={handleUnfollow}>
          Unfollow
        </button>
        <button className="message-btn">
          Message
        </button>
      </div>
    )}
  </div>
  )
}

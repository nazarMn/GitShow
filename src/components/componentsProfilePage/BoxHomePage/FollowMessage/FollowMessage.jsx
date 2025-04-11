import React, { useState, useEffect } from 'react';
import './FollowMessage.css';

export default function FollowMessage({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const currentUserRes = await fetch('/api/current-user');
        const currentUserData = await currentUserRes.json();

        setCurrentUserId(currentUserData.id);

        const currentUserFullRes = await fetch(`/api/user/${currentUserData.id}`);
        const currentUserFull = await currentUserFullRes.json();

        if (currentUserFull.following.includes(user._id)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    fetchFollowStatus();
  }, [user._id]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/follow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsFollowing(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/unfollow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsFollowing(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (!currentUserId || currentUserId === user._id) return null; 

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
  );
}

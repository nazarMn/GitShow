import React, { useState, useEffect } from 'react';
import './FollowMessage.css';

import { useNavigate } from 'react-router-dom';

export default function FollowMessage({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/current-user');
        const data = await res.json();
        setCurrentUserId(data.id);

        if (user.followers.some(follower => follower._id === data.id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error('Error fetching current user', err);
      }
    };

    fetchCurrentUser();
  }, [user]);

  const handleFollow = async () => {
    const response = await fetch(`/api/follow/${user._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (response.ok) {
      setIsFollowing(true);
    } else {
      alert(data.message);
    }
  };

  const handleUnfollow = async () => {
    const response = await fetch(`/api/unfollow/${user._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (response.ok) {
      setIsFollowing(false);
    } else {
      alert(data.message);
    }
  };


  const handleMessage = () => {
    if (!currentUserId || !user._id) return;
    navigate(`/chat/${currentUserId}-${user._id}`);
  };

  return (
    <div className="follow-message">
      {!isFollowing ? (
        <button className="follow-btn" onClick={handleFollow}>Follow</button>
      ) : (
        <div className="button-group">
          <button className="unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
          <button className="message-btn" onClick={handleMessage}>Message</button>
        </div>
      )}
    </div>
  );
}

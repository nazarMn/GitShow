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

        const isUserFollowing = user.followers.some(follower => follower._id === data.id);
        setIsFollowing(isUserFollowing);
      } catch (err) {
        console.error('Error fetching current user', err);
      }
    };

    fetchCurrentUser();
  }, [user]);

  const handleFollow = async () => {
    try {
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
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
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
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  const handleMessage = () => {
    if (!currentUserId || !user._id) return;

    const sortedIds = [currentUserId, user._id].sort();
    navigate(`/chat/${sortedIds[0]}-${sortedIds[1]}`);
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

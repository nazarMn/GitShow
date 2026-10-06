import React, { useState, useEffect } from 'react';
import type { UserProfile } from '@/shared/types/domain';
import type { ApiMessageResponse, CurrentUserResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tw } from '@/shared/lib/tailwind';


interface FollowMessageProps { user: UserProfile; }

export default function FollowMessage({ user }: FollowMessageProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/current-user');
        const data = await readJson<CurrentUserResponse>(res);
        setCurrentUserId(data.id ?? null);

        const isUserFollowing = user.followers?.some((follower) => follower._id === data.id) ?? false;
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
      const data = await readJson<ApiMessageResponse>(response);
      if (response.ok) {
        setIsFollowing(true);
        toast.success(`You are now following ${user.username}`);
      } else {
        toast.error(data.message || 'Failed to follow user');
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('An error occurred while following user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/unfollow/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await readJson<ApiMessageResponse>(response);
      if (response.ok) {
        setIsFollowing(false);
        toast.info(`You unfollowed ${user.username}`);
      } else {
        toast.error(data.message || 'Failed to unfollow user');
      }
    } catch (error) {
      console.error('Unfollow error:', error);
      toast.error('An error occurred while unfollowing user');
    }
  };

  const handleMessage = () => {
    if (!currentUserId || !user._id) return;

    const sortedIds = [currentUserId, user._id].sort();
    navigate(`/chat/${sortedIds[0]}-${sortedIds[1]}`);
  };

  return (
    <div className={tw("follow-message")}>
      {!isFollowing ? (
        <button className={tw("follow-btn")} onClick={handleFollow}>Follow</button>
      ) : (
        <div className={tw("button-group")}>
          <button className={tw("unfollow-btn")} onClick={handleUnfollow}>Unfollow</button>
          <button className={tw("message-btn")} onClick={handleMessage}>Message</button>
        </div>
      )}
    </div>
  );
}

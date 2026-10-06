import React from 'react';
import type { FollowListType, UserSummary } from '@/shared/types/domain';
import type { ApiMessageResponse, CurrentUserResponse, UnreadCountResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tw } from '@/shared/lib/tailwind';

interface FollowInfoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  data?: UserSummary[];
  type: FollowListType | '';
}

export default function FollowInfoModal({ isOpen, onRequestClose, data = [], type }: FollowInfoModalProps) {
 const [users, setUsers] = React.useState<UserSummary[]>(data);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = React.useState<Record<string, number>>({});
  const navigate = useNavigate();

  React.useEffect(() => {
    setUsers(data);
  }, [data]);


  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/current-user');
        const data = await readJson<CurrentUserResponse>(res);
        setCurrentUserId(data.id ?? null);
      } catch (err) {
        console.error('Error fetching current user', err);
      }
    };
    fetchCurrentUser();
  }, []);

   React.useEffect(() => {
    if (!currentUserId) return;
    users.forEach(async (user) => {
      const sortedIds = [currentUserId, user._id].sort();
      const chatId = `${sortedIds[0]}-${sortedIds[1]}`;
      try {
        const res = await fetch(`/api/messages/unread-count/${chatId}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const { unreadCount } = await readJson<UnreadCountResponse>(res);
          setUnreadCounts(prev => ({ ...prev, [user._id]: unreadCount }));
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    });
  }, [currentUserId, users]);

  const handleUserClick = (userId: string) => {
    navigate(`/public-profile/${userId}`);
    onRequestClose();
  };

  const handleUnfollow = async (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/unfollow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        toast.info('Successfully unfollowed');
      } else {
        const data = await readJson<ApiMessageResponse>(response);
        toast.error(data.message || 'Failed to unfollow');
      }
    } catch (error) {
      console.error('Unfollow error:', error);
      toast.error('Error unfollowing user');
    }
  };

   const handleMessage = async (targetUserId: string) => {
    if (!currentUserId || !targetUserId) return;
    const sortedIds = [currentUserId, targetUserId].sort();
    const chatId = `${sortedIds[0]}-${sortedIds[1]}`;

    // Оновлюємо статус прочитання при переході в чат
    await fetch('/api/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ chatId }),
    });

    // Очищаємо лічильник непрочитаних для цього користувача
    setUnreadCounts(prev => ({ ...prev, [targetUserId]: 0 }));

    navigate(`/chat/${chatId}`);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={tw("customModal")}
      overlayClassName={"customOverlay"}
      ariaHideApp={false}
    >
      <div className={tw("modalHeader")}>
        <h2 className={tw("modalTitle")}>{type === 'followers' ? 'Followers' : 'Following'}</h2>
        <button className={tw("closeBtn")} onClick={onRequestClose}>×</button>
      </div>

    <ul className={tw("userList")}>
        {users.length > 0 ? (
          users.map((user, i) => (
            <li key={i} className={tw("userListItem")} onClick={() => handleUserClick(user._id)}>
              <img
                src={user.avatarUrl || './img/account.png'}
                alt={user.username}
                className={tw("userAvatar")}
              />
              <span className={tw("userName")}>{user.username || 'No Name'}</span>

              {unreadCounts[user._id] > 0 && (
                <span className={tw("unreadBadge")}>{unreadCounts[user._id]}</span>
              )}

              <div className={tw("buttonGroup")}>
                <button
                  className={tw("messageBtn")}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(user._id);
                  }}
                >
                  Message
                </button>
                {type === 'following' && (
                  <button
                    className={tw("unfollowBtn")}
                    onClick={(e) => handleUnfollow(e, user._id)}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className={tw("emptyText")}>No {type}</p>
        )}
      </ul>
    </ReactModal>
  );
}

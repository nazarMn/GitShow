import React from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import styles from './FollowInfoModal.module.css';

export default function FollowInfoModal({ isOpen, onRequestClose, data = [], type }) {
 const [users, setUsers] = React.useState(data);
  const [currentUserId, setCurrentUserId] = React.useState(null);
  const [unreadCounts, setUnreadCounts] = React.useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    setUsers(data);
  }, [data]);


  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/current-user');
        const data = await res.json();
        setCurrentUserId(data.id);
      } catch (err) {
        console.error('Error fetching current user', err);
      }
    };
    fetchCurrentUser();
  }, []);

   React.useEffect(() => {
    if (!currentUserId) return;
    users.forEach(async (user) => {
      if (!user._id) return;
      const sortedIds = [currentUserId, user._id].sort();
      const chatId = `${sortedIds[0]}-${sortedIds[1]}`;
      try {
        const res = await fetch(`/api/messages/unread-count/${chatId}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const { unreadCount } = await res.json();
          setUnreadCounts(prev => ({ ...prev, [user._id]: unreadCount }));
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    });
  }, [currentUserId, users]);

  const handleUserClick = (userId) => {
    window.location.href = `/public-profile/${userId}`;
  };

  const handleUnfollow = async (e, userId) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/unfollow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to unfollow');
      }
    } catch (error) {
      console.error('Unfollow error:', error);
      alert('Error unfollowing user');
    }
  };

   const handleMessage = async (targetUserId) => {
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
      className={styles.customModal}
      overlayClassName={styles.customOverlay}
      ariaHideApp={false}
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{type === 'followers' ? 'Followers' : 'Following'}</h2>
        <button className={styles.closeBtn} onClick={onRequestClose}>×</button>
      </div>

    <ul className={styles.userList}>
        {users.length > 0 ? (
          users.map((user, i) => (
            <li key={i} className={styles.userListItem} onClick={() => handleUserClick(user._id)}>
              <img
                src={user.avatarUrl || './img/account.png'}
                alt={user.username}
                className={styles.userAvatar}
              />
              <span className={styles.userName}>{user.username || 'No Name'}</span>

              {unreadCounts[user._id] > 0 && (
                <span className={styles.unreadBadge}>{unreadCounts[user._id]}</span>
              )}

              <div className={styles.buttonGroup}>
                <button
                  className={styles.messageBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(user._id);
                  }}
                >
                  Message
                </button>
                {type === 'following' && (
                  <button
                    className={styles.unfollowBtn}
                    onClick={(e) => handleUnfollow(e, user._id)}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className={styles.emptyText}>No {type}</p>
        )}
      </ul>
    </ReactModal>
  );
}

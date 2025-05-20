import React from 'react';
import ReactModal from 'react-modal';
import styles from './FollowInfoModal.module.css';

export default function FollowInfoModal({ isOpen, onRequestClose, data = [], type }) {
  const [users, setUsers] = React.useState(data);

  React.useEffect(() => {
    setUsers(data);
  }, [data]);

  const handleUserClick = (userId) => {
    window.location.href = `/public-profile/${userId}`;
  };

  const handleUnfollow = async (e, userId) => {
    e.stopPropagation(); 

    try {
      const response = await fetch(`/api/unfollow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

              <div className={styles.buttonGroup}>
                <button className={styles.messageBtn}>Message</button>
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

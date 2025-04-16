import React from 'react';
import ReactModal from 'react-modal';
import styles from './FollowInfoModal.module.css';

export default function FollowInfoModal({ isOpen, onRequestClose, data = [], type }) {
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
        <button className={styles.closeBtn} id="closeBtn" onClick={onRequestClose}>×</button>
      </div>

      <ul className={styles.userList}>
        {data.length > 0 ? (
          data.map((user, i) => (
            <li key={i} className={styles.userListItem}>
              <img
                src={user.avatarUrl || './img/account.png'}
                alt={user.username}
                className={styles.userAvatar}
              />
              <span className={styles.userName}>{user.username || 'No Name'}</span>
            </li>
          ))
        ) : (
          <p className={styles.emptyText}>No {type}</p>
        )}
      </ul>
    </ReactModal>
  );
}

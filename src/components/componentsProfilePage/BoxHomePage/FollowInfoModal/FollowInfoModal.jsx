import React from 'react';
import ReactModal from 'react-modal';
import './FollowInfoModal.css';

export default function FollowInfoModal({ isOpen, onRequestClose, data = [], type }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="customModal"
      overlayClassName="customOverlay"
      ariaHideApp={false}
    >
      <div className="modalHeader">
        <h2 className="modalTitle">{type === 'followers' ? 'Followers' : 'Following'}</h2>
        <button className="closeBtn" onClick={onRequestClose}>×</button>
      </div>

      <ul className="userList">
        {data.length > 0 ? (
          data.map((user, i) => (
            <li key={i} className="userListItem">
              <img
                src={user.avatarUrl || './img/account.png'}
                alt={user.username}
                className="userAvatar"
              />
              <span className="userName">{user.username || 'No Name'}</span>
            </li>
          ))
        ) : (
          <p className="emptyText">No {type}</p>
        )}
      </ul>
    </ReactModal>
  );
}

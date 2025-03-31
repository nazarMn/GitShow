import React, { useState, useEffect } from 'react';
import './ProjectInput.css';

export default function ProjectInput() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Отримуємо поточного користувача при завантаженні
    fetch('/api/current-user')
      .then(res => res.json())
      .then(data => setCurrentUserId(data.id))
      .catch(err => console.error('Error fetching current user:', err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchUsers(searchQuery);
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async (query) => {
    try {
      const response = await fetch(`/api/users?username=${query}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        // Фільтруємо, щоб виключити поточного користувача
        setUsers(data.filter(user => user.githubId !== currentUserId));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="project-input">
      <input
        type="text"
        placeholder="Search for creators"
        value={searchQuery}
        onChange={handleChange}
      />
      {users.length > 0 && (
        <div className="search-results">
          {users.map((user) => (
            <div key={user.githubId} className="user-card">
              <img src={user.avatarUrl} alt={user.username} />
              <div>{user.username}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

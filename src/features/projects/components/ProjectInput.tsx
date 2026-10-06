import React, { useState, useEffect } from 'react';
import type { UserSummary } from '@/shared/types/domain';
import type { CurrentUserResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import { useNavigate } from 'react-router-dom';
import { tw } from '@/shared/lib/tailwind';


export default function ProjectInput() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/current-user')
      .then(res => readJson<CurrentUserResponse>(res))
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

  const fetchUsers = async (query: string) => {
    try {
      const response = await fetch(`/api/users?username=${query}`);
      const data = await readJson<UserSummary[]>(response);

      if (Array.isArray(data)) {
        setUsers(data.filter((user: UserSummary) => user._id !== currentUserId));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/public-profile/${userId}`);
  };

  return (
    <div className={tw("project-input")}>
      <input
        type="text"
        placeholder="Search for creators"
        value={searchQuery}
        onChange={handleChange}
      />
      {users.length > 0 && (
        <div className={tw("search-results")}>
          {users.map((user) => (
            <div
              key={user._id}
              className={tw("user-card")}
              onClick={() => handleUserClick(user._id)}
            >
              <img src={user.avatarUrl} alt={user.username} />
              <div>{user.username}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

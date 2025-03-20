import React, { useState, useEffect } from 'react';
import './Resume.css';

export default function Resume() {
  const [items, setItems] = useState([]);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/resumes`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch resumes');

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const response = await fetch(`${API_URL}/api/user`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();
        setYearsOfExperience(userData.YearsOfExperience || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const totalPages = Math.max(Math.ceil(items.length / itemsPerPage), 1);
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className="resume-container">
      <div className="resume-containerTop">
        <h2>My Resume</h2>
        <h3>{yearsOfExperience ? `${yearsOfExperience}+ YEARS OF EXPERIENCE` : 'Loading experience...'}</h3>
      </div>
      <div className="resume-containerBottom">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : items.length === 0 ? (
          <p>No resumes available.</p>
        ) : (
          <>
            <div className="resume-line"></div>
            {currentItems.map((item) => (
              <div
                className={`resume-card ${item._id % 2 === 0 ? 'left' : 'right'}`}
                key={item._id}
              >
                <div
                  className={`resume-branch ${item._id % 2 === 0 ? 'branch-left' : 'branch-right'}`}
                >
                  <div className="resume-dot"></div>
                </div>
                <div className="resume-content">
                  <h2>{item.title}</h2>
                  <p className="resume-university">{item.university}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPageSafe - 1)}
            disabled={currentPageSafe === 1}
          >
            Previous
          </button>
          <span>{currentPageSafe} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(currentPageSafe + 1)}
            disabled={currentPageSafe === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

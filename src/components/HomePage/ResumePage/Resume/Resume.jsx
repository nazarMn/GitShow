import React, { useState, useEffect } from 'react';
import './Resume.css';

export default function Resume() {
  const [items, setItems] = useState([]);
  const [yearsOfExperience, setYearsOfExperience] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/resumes', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch resumes');
        }
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
        const response = await fetch('http://localhost:3000/api/user', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setYearsOfExperience(userData.YearsOfExperience || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentPageSafe = Math.min(currentPage, totalPages || 1);
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
        ) : currentItems.length === 0 ? (
          <p>No resumes available.</p>
        ) : (
          <>
            <div className="resume-line"></div>
            {currentItems.map((item, index) => (
              <div
                className={`resume-card ${index % 2 === 0 ? 'left' : 'right'}`}
                key={index}
              >
                <div
                  className={`resume-branch ${index % 2 === 0 ? 'branch-left' : 'branch-right'}`}
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

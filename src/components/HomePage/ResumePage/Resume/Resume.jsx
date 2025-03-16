import React, { useState, useEffect } from 'react';
import './Resume.css';

export default function Resume() {
  const [items, setItems] = useState([]);
  const [yearsOfExperience, setYearsOfExperience] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  // Fetch resumes from the API
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/resumes', {
          credentials: 'include', // Include cookies for authentication
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

  // Fetch user data to get YearsOfExperience
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setYearsOfExperience(userData.YearsOfExperience || 0); // Default to 0 if not set
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
                  className={`resume-branch ${
                    index % 2 === 0 ? 'branch-left' : 'branch-right'
                  }`}
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

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import './Resume.css';

export default function Resume() {
  const items = [
    { title: 'Computer Science', university: 'Cambridge University / 2005 - 2008', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'Software Engineer', university: 'Cambridge University / 2005 - 2008', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'Bachelor Degree', university: 'Cambridge University / 2005 - 2008', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'Back-End Developer', university: 'Cambridge University / 2005 - 2008', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'Back-End Developer', university: 'Cambridge University / 2005 - 2008', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'Full-Stack Developer', university: 'Harvard University / 2010 - 2014', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'DevOps Engineer', university: 'Oxford University / 2014 - 2018', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'Machine Learning Engineer', university: 'MIT University / 2018 - 2022', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
    { title: 'CTO', university: 'Stanford University / 2022 - Present', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio quo repudiandae consectetur adipisicing elit.' },
  ];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

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
        <h3>9+ YEARS OF EXPERIENCE</h3>
      </div>
      <div className="resume-containerBottom">
        <div className="resume-line"></div>
        {currentItems.map((item, index) => (
          <div
            className={`resume-card ${index % 2 === 0 ? 'left' : 'right'}`}
            key={index}
          >
            <div className={`resume-branch ${index % 2 === 0 ? 'branch-left' : 'branch-right'}`}>
              <div className="resume-dot"></div>
            </div>
            <div className="resume-content">
              <h2>{item.title}</h2>
              <p className="resume-university">{item.university}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
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

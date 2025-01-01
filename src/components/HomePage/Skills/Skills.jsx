import React, { useState } from 'react';
import './Skills.css';

const services = [
  { id: 1, title: 'Web Design', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 2, title: 'UI/UX Design', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 3, title: 'Mobile Application', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 4, title: 'User Research', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 5, title: 'Animation', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 6, title: 'Game Development', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 7, title: 'AI Development', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 8, title: 'Cloud Computing', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
  { id: 9, title: 'Cybersecurity', description: 'Website development is the process of building, programming, maintaining websites and web applications.' },
];

export default function Skills() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const currentServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="skills">
      <div className="skillsTop">
        <header className="skills-header">
          <h2>MY SERVICES</h2>
          <h1>Skillset and Expertise</h1>
        </header>
      </div>
      <div className="skillsBottom">
        <section className="skills-list">
          {currentServices.map((service) => (
            <div key={service.id} className="skill-card">
              <h2>{`0${service.id}`}</h2>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </section>
        <footer className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </footer>
      </div>
    </div>
  );
}

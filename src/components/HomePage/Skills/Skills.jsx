import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Skills.css';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('/api/skills'); // Запит до бекенду
        setSkills(response.data); // Зберігаємо отримані дані
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const currentSkills = skills.slice(
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
          {currentSkills.map((skill, index) => (
            <div key={skill._id} className="skill-card">
              <h2>{String(index + 1).padStart(2, '0')}</h2>
              <h3>{skill.titleSkill}</h3>
              <p>{skill.descriptionSkill}</p>
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

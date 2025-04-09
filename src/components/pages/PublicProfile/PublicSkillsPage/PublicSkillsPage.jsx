import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // <-- для отримання userId з URL

import './PublicSkillsPage.css';
import SkillCard from '../../../componentsProfilePage/BoxSkillsPage/SkillCard/SkillCard';
import Pagination from '../../../componentsProfilePage/PaginationButton/PaginationButton';

export default function PublicSkills() {
  const { userId } = useParams(); // <-- витягуємо ID з URL
  const [skills, setSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}/skills`); // <-- динамічний запит
        setSkills(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      }
    };

    if (userId) {
      fetchSkills();
    }
  }, [userId]);

  const totalPages = Math.max(1, Math.ceil(skills.length / itemsPerPage));
  const currentSkills = skills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {currentSkills.length > 0 ? (
            currentSkills.map((skill, index) => (
              <SkillCard
                key={skill._id || index}
                number={index + 1 + (currentPage - 1) * itemsPerPage}
                title={skill.titleSkill}
                description={skill.descriptionSkill}
              />
            ))
          ) : (
            <p className="no-skills">No skills available.</p>
          )}
        </section>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

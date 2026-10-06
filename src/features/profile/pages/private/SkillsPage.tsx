import React, { useState, useEffect } from 'react';
import type { SkillRecord } from '@/shared/types/domain';
import axios from 'axios';

import SkillCard from "@/features/profile/components/skills/SkillCard";
import Pagination from "@/shared/components/Pagination";
import { tw } from '@/shared/lib/tailwind';


export default function Skills() {
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get<SkillRecord[]>('/api/skills');
        setSkills(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      }
    };
    fetchSkills();
  }, []);

  const totalPages = Math.max(1, Math.ceil(skills.length / itemsPerPage));
  const currentSkills = skills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={tw("skills")}>
      <div className={tw("skillsTop")}>
        <header className={tw("skills-header")}>
          <h2>MY SERVICES</h2>
          <h1>Skillset and Expertise</h1>
        </header>
      </div>

      <div className={tw("skillsBottom")}>
        <section className={tw("skills-list")}>
          {currentSkills.length > 0 ? (
            currentSkills.map((skill, index) => (
              <SkillCard
                key={skill._id || index}
                number={index + 1 + (currentPage - 1) * itemsPerPage}
                title={skill.titleSkill ?? ''}
                description={skill.descriptionSkill}
              />
            ))
          ) : (
            <p className={tw("no-skills")}>No skills available.</p>
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

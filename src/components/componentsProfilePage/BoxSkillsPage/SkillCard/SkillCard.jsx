import React from 'react';

import './SkillCard.css';

export default function SkillCard({ number, title, description }) {
  return (
    <div className="skill-card">
      <h2>{String(number).padStart(2, '0')}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

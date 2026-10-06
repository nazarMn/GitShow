import React from 'react';
import { tw } from '@/shared/lib/tailwind';



interface SkillCardProps { number: number; title: string; description?: string; }

export default function SkillCard({ number, title, description }: SkillCardProps) {
  return (
    <div className={tw("skill-card")}>
      <h2>{String(number).padStart(2, '0')}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

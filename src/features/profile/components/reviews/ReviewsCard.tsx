import React from 'react';
import { tw } from '@/shared/lib/tailwind';


interface ReviewsCardProps { stars: number; text: string; name: string; role: string; image: string; }

export default function ReviewsCard({ stars, text, name, role, image }: ReviewsCardProps) {
  return (
    <div className={tw("reviews-card")}>
      <div className={tw("stars")}>
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </div>
      <p className={tw("review-text")}>{text}</p>
      <div className={tw("reviewer")}>
        <img src={image} alt={`${name}'s profile`} className={tw("reviewer-image")} />
        <div>
          <p className={tw("reviewer-name")}>{name}</p>
          <p className={tw("reviewer-role")}>{role}</p>
        </div>
      </div>
    </div>
  );
}

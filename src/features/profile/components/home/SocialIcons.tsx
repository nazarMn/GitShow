import React from 'react';
import type { UserProfile } from '@/shared/types/domain';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { tw } from '@/shared/lib/tailwind';



interface SocialIconsProps { user: UserProfile; }

export default function SocialIcons({ user }: SocialIconsProps) {
  return (
    <div className={tw("socialIcons")}>
      {user.profileUrl && (
        <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} size="2x" color="#fff" />
        </a>
      )}
      {user.instagram && (
        <a href={user.instagram} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="2x" color="#fff" />
        </a>
      )}
      {user.facebook && (
        <a href={user.facebook} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} size="2x" color="#fff" />
        </a>
      )}
      {user.twitter && (
        <a href={user.twitter} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="2x" color="#fff" />
        </a>
      )}
    </div>
  );
}

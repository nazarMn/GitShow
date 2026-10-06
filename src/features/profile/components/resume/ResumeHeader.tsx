import { tw } from '@/shared/lib/tailwind';

interface ResumeHeaderProps { years: number | string | null; }

export default function ResumeHeader({ years }: ResumeHeaderProps) {
    return (
      <div className={tw("resume-containerTop")}>
        <h2>My Resume</h2>
        <h3>{years ? `${years}+ YEARS OF EXPERIENCE` : 'Loading experience...'}</h3>
      </div>
    );
  }

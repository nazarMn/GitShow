import type { ResumeRecord } from '@/shared/types/domain';
import { tw } from '@/shared/lib/tailwind';


interface ResumeCardProps { item: ResumeRecord; index: number; }

export default function ResumeCard({ item, index }: ResumeCardProps) {
    return (
      <div className={tw(`resume-card ${index % 2 === 0 ? 'left' : 'right'}`)}>
        <div className={tw(`resume-branch ${index % 2 === 0 ? 'branch-left' : 'branch-right'}`)}>
          <div className={tw("resume-dot")}></div>
        </div>
        <div className={tw("resume-content")}>
          <h2>{item.title}</h2>
          <p className={tw("resume-university")}>{item.university}</p>
          <p>{item.description ?? ''}</p>
        </div>
      </div>
    );
  }

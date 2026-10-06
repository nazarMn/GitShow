import ResumeCard from "@/features/profile/components/resume/ResumeCard";
import type { ResumeRecord } from "@/shared/types/domain";
import { tw } from '@/shared/lib/tailwind';



interface ResumeListProps { items: ResumeRecord[]; loading: boolean; error: string | null; }

export default function ResumeList({ items, loading, error }: ResumeListProps) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (items.length === 0) return <p>No resumes available.</p>;

  return (
    <div className={tw("resume-containerBottom")}>
      <div className={tw("resume-line")}></div>
      {items.map((item, index) => (
        <ResumeCard key={index} item={item} index={index} />
      ))}
    </div>
  );
}

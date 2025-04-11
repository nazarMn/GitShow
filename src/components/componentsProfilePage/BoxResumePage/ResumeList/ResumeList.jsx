import ResumeCard from '../ResumeCard/ResumeCard';

import './ResumeList.css';

export default function ResumeList({ items, loading, error }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (items.length === 0) return <p>No resumes available.</p>;

  return (
    <div className="resume-containerBottom">
      <div className="resume-line"></div>
      {items.map((item, index) => (
        <ResumeCard key={index} item={item} index={index} />
      ))}
    </div>
  );
}

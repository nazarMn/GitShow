import './ResumeCard.css';
export default function ResumeCard({ item, index }) {
    return (
      <div className={`resume-card ${index % 2 === 0 ? 'left' : 'right'}`}>
        <div className={`resume-branch ${index % 2 === 0 ? 'branch-left' : 'branch-right'}`}>
          <div className="resume-dot"></div>
        </div>
        <div className="resume-content">
          <h2>{item.title}</h2>
          <p className="resume-university">{item.university}</p>
          <p>{item.description}</p>
        </div>
      </div>
    );
  }
  
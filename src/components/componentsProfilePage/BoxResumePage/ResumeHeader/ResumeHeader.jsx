
import './ResumeHeader.css';
export default function ResumeHeader({ years }) {
    return (
      <div className="resume-containerTop">
        <h2>My Resume</h2>
        <h3>{years ? `${years}+ YEARS OF EXPERIENCE` : 'Loading experience...'}</h3>
      </div>
    );
  }
  
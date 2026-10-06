import React, { useState, useEffect } from 'react';
import type { CVExperience, CVRecord } from '@/shared/types/domain';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';
import { tw } from '@/shared/lib/tailwind';


export default function SharedCVRevue() {
  const [cvData, setCvData] = useState<CVRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { shareLink } = useParams();

  useEffect(() => {

    // Функція для отримання даних CV з MongoDB за посиланням
    const fetchSharedCVData = async () => {
      try {
        setLoading(true);
        console.log("Fetching shared CV data with link:", shareLink);
        const response = await axios.get<CVRecord>(`/api/cv/share/${shareLink}`);
        console.log("Response data:", response.data);
        setCvData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shared CV data:', err);
        setError('Failed to load CV. The link may be invalid or expired.');
        setLoading(false);
      }
    };

    if (shareLink) {
      fetchSharedCVData();
    } else {
      setError('Invalid link. No share ID provided.');
      setLoading(false);
    }
  }, [shareLink]);

  // Відображення завантаження
  if (loading) {
    return (
      <div className={tw("CV-Revue-Loading")}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading CV data...</p>
      </div>
    );
  }

  // Відображення помилки
  if (error) {
    return (
      <div className={tw("CV-Revue-Error")}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Відображення інформації про відсутність CV
  if (!cvData) {
    return (
      <div className={tw("CV-Revue-Empty")}>
        <p>CV not found. The link may be invalid or expired.</p>
      </div>
    );
  }

  // Форматування років освіти
  const formatEducationYears = () => {
    const { startYear, endYear } = cvData.education || {};
    if (startYear && endYear) {
      return `${startYear} - ${endYear}`;
    } else if (startYear) {
      return `${startYear} - Present`;
    } else if (endYear) {
      return `Until ${endYear}`;
    }
    return '';
  };

  // Отримання описів для досвіду роботи
  const getExperienceDescriptions = (experience: CVExperience): string[] => {
    // Перевіряємо, чи є масив descriptions
    if (experience.descriptions && Array.isArray(experience.descriptions) && experience.descriptions.length > 0) {
      return experience.descriptions;
    }
    // Якщо немає масиву, але є одиночне поле description
    else if (experience.description) {
      return [experience.description];
    }
    return [];
  };

  return (
    <div className={tw("CV-Revue shared-view")}>

      <header className={tw("CV-Revue-header")}>
        <div className={tw("CV-Revue-header-Left")}>
          <img
            src={cvData.avatarUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className={tw("profile-img")}
          />
        </div>

        <div className={tw("CV-Revue-header-Right")}>
          <h2>{cvData.name || "Name"}</h2>
          <p>{cvData.specialty || "Profession"}</p>
        </div>
        <div className={tw("triangle")}></div>
      </header>

      <div className={tw("CV-Revue-Container")}>
        <div className={tw("CV-Revue-Container-Left")}>
          <div className={tw("Contact-Сontainer")}>
            <h2 className={tw("Section-Title")}>Contact Details</h2>
            {cvData.email && (
              <div className={tw("Contact-Item")}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>{cvData.email}</span>
              </div>
            )}
            {cvData.phoneNumber && (
              <div className={tw("Contact-Item")}>
                <FontAwesomeIcon icon={faPhone} />
                <span>{cvData.phoneNumber}</span>
              </div>
            )}
            {cvData.location && (
              <div className={tw("Contact-Item")}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{cvData.location}</span>
              </div>
            )}
          </div>

          <div className={tw("Education-Container")}>
            <h2 className={tw("Section-Title")}>Education</h2>
            {cvData.education && (cvData.education.university || cvData.education.specialty) ? (
              <div className={tw("Education-Content")}>
                <div className={tw("Education-Details")}>
                  <h3 className={tw("Education-Degree")}>{cvData.education.specialty || "Degree"}</h3>
                  <p className={tw("Education-University")}>{cvData.education.university || "University"}</p>
                  <p className={tw("Education-Year")}>{formatEducationYears()}</p>
                </div>
              </div>
            ) : (
              <p className={tw("No-Content")}>No education information provided</p>
            )}
          </div>

          <div className={tw("Skills-Container")}>
            <h2 className={tw("Section-Title")}>Skills</h2>
            {cvData.skills && cvData.skills.length > 0 ? (
              <ul className={tw("Skills-List")}>
                {cvData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className={tw("No-Content")}>No skills provided</p>
            )}
          </div>
        </div>

        <div className={tw("CV-Revue-Container-Right")}>
          <div className={tw("Summary-Container")}>
            <header className={tw("Summary-Title")}>Summary</header>
            {cvData.summary ? (
              <p>{cvData.summary}</p>
            ) : (
              <p className={tw("No-Content")}>No summary provided</p>
            )}
          </div>

          <div className={tw("Experience-Container")}>
            <header className={tw("Experience-Title")}>Work Experience</header>
            {cvData.experience && cvData.experience.length > 0 ? (
              cvData.experience.map((exp, index) => (
                <div className={tw("Experience-Item")} key={index}>
                  <h3>{exp.name || "Job Title"}</h3>
                  <p className={tw("Experience-Date")}>{exp.yearsAndPosition || "Employment Period"}</p>
                  <ul>
                    {getExperienceDescriptions(exp).map((desc, descIndex) => (
                      <li key={descIndex}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className={tw("No-Content")}>No work experience provided</p>
            )}
          </div>

          <div className={tw("Reference-Container")}>
            <header className={tw("Reference-Title")}>References</header>
            {cvData.references && cvData.references.length > 0 ? (
              <ul className={tw("Reference-List")}>
                {cvData.references.map((reference, index) => (
                  <li key={index}>{reference}</li>
                ))}
              </ul>
            ) : (
              <p>References available upon request</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

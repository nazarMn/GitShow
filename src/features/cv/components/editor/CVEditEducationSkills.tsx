import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { CVRecord } from '@/shared/types/domain';
import { tw } from '@/shared/lib/tailwind';


interface CVEducationSkillsForm {
  education: {
    university: string;
    specialty: string;
    startYear: string;
    endYear: string;
  };
  skills: string[];
}

export default function CVEditEduSkills() {
  const [cvData, setCvData] = useState<CVEducationSkillsForm>({
    education: {
      university: '',
      specialty: '',
      startYear: '',
      endYear: ''
    },
    skills: [''],
  });

  useEffect(() => {
    axios.get<CVRecord>('/api/cv')
      .then(({ data }) => {
        const skills = data.skills?.length ? data.skills : [''];
        setCvData({
          education: {
            university: data.education?.university ?? '',
            specialty: data.education?.specialty ?? '',
            startYear: String(data.education?.startYear ?? ''),
            endYear: String(data.education?.endYear ?? ''),
          },
          skills,
        });
      })
      .catch(err => console.error('Error fetching CV:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id.startsWith('Skills')) {
      const index = Number(id.replace('Skills', '')) - 1;
      const newSkills = [...cvData.skills];
      newSkills[index] = value;
      setCvData({ ...cvData, skills: newSkills });
    } else {
      setCvData({
        ...cvData,
        education: { ...cvData.education, [id]: value }
      });
    }
  };

  const addSkillField = () => {
    if (cvData.skills.length < 6) {
      setCvData({
        ...cvData,
        skills: [...cvData.skills, '']
      });
    }
  };


  const isLastSkillFilled = cvData.skills.length > 0 &&
    cvData.skills[cvData.skills.length - 1].trim() !== '';


  const canAddMoreSkills = cvData.skills.length < 6 && isLastSkillFilled;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredSkills = cvData.skills.filter(skill => skill.trim() !== '');

    try {
      await axios.put<CVRecord>('/api/cv', {
        ...cvData,
        skills: filteredSkills
      });
      toast.success('CV updated successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error('Failed to update CV!', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className={tw("CV-Edit-Edu-Skills")}>
      <div className={tw("CVEES-Content")}>
        <div className={tw("CVEES-Main")}>
          <form onSubmit={handleSubmit}>
            <div className={tw("skills-container")}>
              <h3>Skills</h3>
              {cvData.skills.map((skill, i) => (
                <div className={tw("CVEES-group")} key={i}>
                  <label htmlFor={`Skills${i + 1}`}>Skill {i + 1}</label>
                  <input
                    type="text"
                    id={`Skills${i + 1}`}
                    placeholder={`Skill ${i + 1}`}
                    value={skill}
                    onChange={handleInputChange}
                  />
                </div>
              ))}


              {cvData.skills.length < 6 && (
                <button
                  type="button"
                  onClick={addSkillField}
                  disabled={!canAddMoreSkills}
                  className={tw(`btn-add-skill ${!canAddMoreSkills ? 'disabled' : ''}`)}
                >
                  Add Skill ({cvData.skills.length}/6)
                </button>
              )}
            </div>

            <div className={tw("education-container")}>
              <h3>Education</h3>
              <div className={tw("CVEES-group")}>
                <label htmlFor="university">University</label>
                <input
                  type="text"
                  id="university"
                  placeholder="Name of the university"
                  value={cvData.education.university}
                  onChange={handleInputChange}
                />
              </div>

              <div className={tw("CVEES-group")}>
                <label htmlFor="specialty">Specialty</label>
                <input
                  type="text"
                  id="specialty"
                  placeholder="Specialty for which you studied"
                  value={cvData.education.specialty}
                  onChange={handleInputChange}
                />
              </div>

              <div className={tw("CVEES-group")}>
                <label htmlFor="startYear">Education Period</label>
                <input
                  type="text"
                  id="startYear"
                  placeholder="Start Year"
                  maxLength={4}
                  value={cvData.education.startYear}
                  onChange={handleInputChange}
                />
              </div>

              <div className={tw("CVEES-group")}>
                <input
                  type="text"
                  id="endYear"
                  placeholder="End Year"
                  maxLength={4}
                  value={cvData.education.endYear}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className={tw("btn-save-CVEES")}>Update CV</button>
          </form>
        </div>
      </div>
    </div>
  );
}

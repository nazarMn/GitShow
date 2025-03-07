import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CVEditEduSkills.css';

export default function CVEditEduSkills() {
  const [cvData, setCvData] = useState({
    education: {
      university: '',
      specialty: '',
      startYear: '',
      endYear: ''
    },
    skills: ['', '', '', '', ''],
  });

  useEffect(() => {
    axios.get('/api/cv')
      .then(res => setCvData(res.data))
      .catch(err => console.error('Error fetching CV:', err));
  }, []);

  const handleInputChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/cv', cvData);
      toast.success('CV updated successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error('Failed to update CV!', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="CV-Edit-Edu-Skills">
      <div className="CVEES-Content">
        <div className="CVEES-Main">
          <form onSubmit={handleSubmit}>
            {[...Array(5)].map((_, i) => (
              <div className="CVEES-group" key={i}>
                <label htmlFor={`Skills${i + 1}`}>Skill {i + 1}</label>
                <input
                  type="text"
                  id={`Skills${i + 1}`}
                  placeholder={`Skill ${i + 1}`}
                  value={cvData.skills[i]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div className="CVEES-group">
              <label htmlFor="university">Education</label>
              <input
                type="text"
                id="university"
                placeholder="Name of the university"
                value={cvData.education.university}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="CVEES-group">
              <input
                type="text"
                id="specialty"
                placeholder="Specialty for which you studied"
                value={cvData.education.specialty}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="CVEES-group">
              <label htmlFor="startYear">Education Period</label>
              <input
                type="text"
                id="startYear"
                placeholder="Start Year"
                maxLength="4"
                value={cvData.education.startYear}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="CVEES-group">
              <input
                type="text"
                id="endYear"
                placeholder="End Year"
                maxLength="4"
                value={cvData.education.endYear}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn-save-CVEES">Update CV</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

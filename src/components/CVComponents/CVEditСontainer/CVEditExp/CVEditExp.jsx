import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CVEditExp.css';

export default function CVEditExp() {
  const [cvData, setCvData] = useState({ experience: [] });

  useEffect(() => {
    axios.get('/api/cv')
      .then(res => {
        console.log('Fetched CV:', res.data);
        setCvData({
          experience: Array.isArray(res.data.experience) ? res.data.experience : [],
        });
      })
      .catch(err => console.error('Error fetching CV:', err));
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExperience = [...cvData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setCvData({ ...cvData, experience: updatedExperience });
  };

  const addExperience = () => {
    if (cvData.experience.length >= 3) {
      toast.warn('Maximum 3 experiences allowed!', { position: 'top-right', autoClose: 2000 });
      return;
    }

    // Перевіряємо, чи останній досвід заповнений
    const lastExp = cvData.experience[cvData.experience.length - 1];
    if (lastExp && (!lastExp.name || !lastExp.yearsAndPosition || !lastExp.description)) {
      toast.warn('Please fill in the previous experience before adding a new one.', {
        position: 'top-right',
        autoClose: 2000
      });
      return;
    }

    setCvData(prevState => ({
      ...prevState,
      experience: [...prevState.experience, { name: '', yearsAndPosition: '', description: '' }],
    }));
  };

  const removeExperience = (index) => {
    const updatedExperience = [...cvData.experience];
    updatedExperience.splice(index, 1);
    setCvData({ ...cvData, experience: updatedExperience });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/cv', { experience: cvData.experience });
      toast.success('CV updated successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error('Failed to update CV!', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className='CV-Edit-Exp'>
      <ToastContainer />
      <div className="CVEE-Content">
        <div className="CVEE-Main">
          <form onSubmit={handleSubmit}>
            {cvData.experience.length === 0 ? (
              <p>No experience added. Click "Add Experience" to add.</p>
            ) : (
              cvData.experience.map((exp, index) => (
                <div className="CVEE-group" key={index}>
                  <label>Experience {index + 1}</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Experience Name"
                    value={exp.name}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  <input
                    type="text"
                    name="yearsAndPosition"
                    placeholder="Years and Position"
                    value={exp.yearsAndPosition}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  <textarea
                    name="description"
                    placeholder="Description of Experience"
                    value={exp.description}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  <button
                    type="button"
                    className="btn-remove-exp"
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
            <button
              type="button"
              className="btn-add-exp"
              onClick={addExperience}
              disabled={cvData.experience.length >= 3}
            >
              Add Experience
            </button>
            <button type="submit" className="btn-save-CVEE">
              Update CV
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

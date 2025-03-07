import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CVEditExp.css';

export default function CVEditExp() {
  const [cvData, setCvData] = useState({ experience: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('/api/cv')
      .then(res => {
        setCvData({ experience: Array.isArray(res.data.experience) ? res.data.experience : [] });
      })
      .catch(err => console.error('Error fetching CV:', err));
  }, []);

  const validateField = (name, value) => {
    if (!value.trim()) {
      return 'This field is required';
    }
    return '';
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExperience = [...cvData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setCvData({ ...cvData, experience: updatedExperience });
  };

  const handleBlur = (e, index) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [`${index}-${name}`]: error }));
  };

  const addExperience = () => {
    if (cvData.experience.length >= 2) {
      toast.warn('Maximum 2 experiences allowed!', { position: 'top-right', autoClose: 2000 });
      return;
    }

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

  const removeExperience = (index, expId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this experience?</p>
        <button onClick={() => confirmDelete(index, expId)} className="btn-confirm">Yes</button>
        <button onClick={() => toast.dismiss()} className="btn-cancel">No</button>
      </div>,
      { position: 'top-center', autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async (index, expId) => {
    try {
      await axios.delete(`/api/cv/experience/${expId}`);
      
      const updatedExperience = [...cvData.experience];
      updatedExperience.splice(index, 1);
      setCvData({ ...cvData, experience: updatedExperience });

      toast.dismiss();
      toast.success('Experience deleted successfully!', { position: 'top-center', autoClose: 2000 });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience!', { position: 'top-center', autoClose: 2000 });
    }
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
                    onBlur={(e) => handleBlur(e, index)}
                    className={errors[`${index}-name`] ? 'error-input' : ''}
                  />
                  {errors[`${index}-name`] && <p className="error-text">{errors[`${index}-name`]}</p>}
                  <input
                    type="text"
                    name="yearsAndPosition"
                    placeholder="Years and Position"
                    value={exp.yearsAndPosition}
                    onChange={(e) => handleInputChange(e, index)}
                    onBlur={(e) => handleBlur(e, index)}
                    className={errors[`${index}-yearsAndPosition`] ? 'error-input' : ''}
                  />
                  {errors[`${index}-yearsAndPosition`] && <p className="error-text">{errors[`${index}-yearsAndPosition`]}</p>}
                  <textarea
                    name="description"
                    placeholder="Description of Experience"
                    value={exp.description}
                    onChange={(e) => handleInputChange(e, index)}
                    onBlur={(e) => handleBlur(e, index)}
                    className={errors[`${index}-description`] ? 'error-input' : ''}
                  />
                  {errors[`${index}-description`] && <p className="error-text">{errors[`${index}-description`]}</p>}
                  <button
                    type="button"
                    className="btn-remove-exp"
                    onClick={() => removeExperience(index, exp._id)}
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
              disabled={cvData.experience.length >= 2}
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

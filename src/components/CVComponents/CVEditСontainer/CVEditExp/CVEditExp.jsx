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
        const experience = Array.isArray(res.data.experience) ? res.data.experience : [];
        
        const formattedExperience = experience.map(exp => {
          if (exp.description && !Array.isArray(exp.description)) {
            return {
              ...exp,
              descriptions: [exp.description]
            };
          } 
          else if (exp.descriptions && Array.isArray(exp.descriptions)) {
            return exp;
          }
          else {
            return {
              ...exp,
              descriptions: ['']
            };
          }
        });
        
        setCvData({ experience: formattedExperience });
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
    
    if (name.startsWith('description-')) {
      const descIndex = parseInt(name.split('-')[1]);
      const descriptions = [...(updatedExperience[index].descriptions || [''])];
      descriptions[descIndex] = value;
      updatedExperience[index] = { ...updatedExperience[index], descriptions };
    } else {
      updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    }
    
    setCvData({ ...cvData, experience: updatedExperience });
  };

  const handleBlur = (e, expIndex, descIndex = null) => {
    const { name, value } = e.target;
    let errorKey;
    
    if (descIndex !== null) {
      errorKey = `${expIndex}-description-${descIndex}`;
    } else {
      errorKey = `${expIndex}-${name}`;
    }
    
    const error = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [errorKey]: error }));
  };

  const addDescription = (expIndex) => {
    const updatedExperience = [...cvData.experience];
    const exp = updatedExperience[expIndex];
    
    const descriptions = exp.descriptions || [''];
    if (descriptions.length >= 3) {
      toast.warn('Maximum 3 descriptions allowed per experience!', { position: 'top-right', autoClose: 2000 });
      return;
    }
    
    if (!descriptions[descriptions.length - 1].trim()) {
      toast.warn('Please fill in the previous description first.', { position: 'top-right', autoClose: 2000 });
      return;
    }
    
    descriptions.push('');
    updatedExperience[expIndex] = { ...exp, descriptions };
    setCvData({ ...cvData, experience: updatedExperience });
  };

  const removeDescription = (expIndex, descIndex) => {
    if (cvData.experience[expIndex].descriptions.length <= 1) {
      toast.warn('At least one description is required!', { position: 'top-right', autoClose: 2000 });
      return;
    }
    
    const updatedExperience = [...cvData.experience];
    const descriptions = [...updatedExperience[expIndex].descriptions];
    descriptions.splice(descIndex, 1);
    updatedExperience[expIndex] = { ...updatedExperience[expIndex], descriptions };
    setCvData({ ...cvData, experience: updatedExperience });
  };

  const addExperience = () => {
    if (cvData.experience.length >= 2) {
      toast.warn('Maximum 2 experiences allowed!', { position: 'top-right', autoClose: 2000 });
      return;
    }

    const lastExp = cvData.experience[cvData.experience.length - 1];
    if (lastExp && (!lastExp.name || !lastExp.yearsAndPosition || 
        !lastExp.descriptions || !lastExp.descriptions[0])) {
      toast.warn('Please fill in the previous experience before adding a new one.', {
        position: 'top-right',
        autoClose: 2000
      });
      return;
    }

    setCvData(prevState => ({
      ...prevState,
      experience: [...prevState.experience, { 
        name: '', 
        yearsAndPosition: '', 
        descriptions: [''] 
      }],
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
      if (expId) {
        await axios.delete(`/api/cv/experience/${expId}`);
      }
      
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
    
    const formattedExperience = cvData.experience.map(exp => {
      return {
        ...exp,
        descriptions: exp.descriptions.filter(desc => desc.trim() !== '')
      };
    });
    
    try {
      await axios.put('/api/cv', { experience: formattedExperience });
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
              cvData.experience.map((exp, expIndex) => (
                <div className="CVEE-group" key={expIndex}>
                  <label>Experience {expIndex + 1}</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Experience Name"
                    value={exp.name}
                    onChange={(e) => handleInputChange(e, expIndex)}
                    onBlur={(e) => handleBlur(e, expIndex)}
                    className={errors[`${expIndex}-name`] ? 'error-input' : ''}
                  />
                  {errors[`${expIndex}-name`] && <p className="error-text">{errors[`${expIndex}-name`]}</p>}
                  
                  <input
                    type="text"
                    name="yearsAndPosition"
                    placeholder="Years and Position"
                    value={exp.yearsAndPosition}
                    onChange={(e) => handleInputChange(e, expIndex)}
                    onBlur={(e) => handleBlur(e, expIndex)}
                    className={errors[`${expIndex}-yearsAndPosition`] ? 'error-input' : ''}
                  />
                  {errors[`${expIndex}-yearsAndPosition`] && <p className="error-text">{errors[`${expIndex}-yearsAndPosition`]}</p>}
                  
                  <div className="descriptions-container">
                    <label>Description{exp.descriptions?.length > 1 ? 's' : ''}</label>
                    
                    {(exp.descriptions || ['']).map((desc, descIndex) => (
                      <div className="description-field" key={descIndex}>
                        <textarea
                          name={`description-${descIndex}`}
                          placeholder={`Description ${descIndex + 1}`}
                          value={desc}
                          onChange={(e) => handleInputChange(e, expIndex)}
                          onBlur={(e) => handleBlur(e, expIndex, descIndex)}
                          className={errors[`${expIndex}-description-${descIndex}`] ? 'error-input' : ''}
                        />
                        {errors[`${expIndex}-description-${descIndex}`] && 
                          <p className="error-text">{errors[`${expIndex}-description-${descIndex}`]}</p>}
                        
                        {descIndex > 0 && (
                          <button
                            type="button"
                            className="btn-remove-desc"
                            onClick={() => removeDescription(expIndex, descIndex)}
                          >
                            Remove Description
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {exp.descriptions?.length < 3 && (
                      <button
                        type="button"
                        className="btn-add-desc"
                        onClick={() => addDescription(expIndex)}
                      >
                        Add Description ({exp.descriptions?.length || 0}/3)
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    className="btn-remove-exp"
                    onClick={() => removeExperience(expIndex, exp._id)}
                  >
                    Remove Experience
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
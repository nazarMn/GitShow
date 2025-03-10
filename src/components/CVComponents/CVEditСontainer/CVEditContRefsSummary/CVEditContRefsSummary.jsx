import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import './CVEditContRefsSummary.css';

export default function CVEditContRefsSummary() {
  const [cvData, setCvData] = useState({
    name: '',
    specialty: '',
    summary: '',
    phoneNumber: '',
    location: '',
    email: '',
    references: ['', '', ''],
    avatarUrl: '' // Add avatarUrl to the state
  });

  useEffect(() => {
    axios.get('/api/cv')
      .then(res => {
        setCvData(res.data); // Fetch data and set it in state
      })
      .catch(err => console.error('Error fetching CV:', err));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith('references')) {
      const index = Number(id.replace('references', '')) - 1;
      const newReferences = [...cvData.references];
      newReferences[index] = value;
      setCvData({ ...cvData, references: newReferences });
    } else {
      setCvData({ ...cvData, [id]: value });
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
    <div className="CV-Edit-Cont-Refs-Summary">
      <div className="CVECRS-Content">
        <div className="CVECRS-Main">
          <form onSubmit={handleSubmit}>
            <div className="CVECRS-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={cvData.name} onChange={handleInputChange} placeholder="Your name" />
            </div>

            <div className="CVECRS-group">
              <label htmlFor="specialty">Specialty</label>
              <input type="text" id="specialty" value={cvData.specialty} onChange={handleInputChange} placeholder="Your specialty" />
            </div>

            <div className="CVECRS-group">
              <label htmlFor="summary">Summary</label>
              <textarea id="summary" value={cvData.summary} onChange={handleInputChange} placeholder="Tell us about yourself"></textarea>
            </div>

            <div className="CVECRS-group">
              <label htmlFor="phoneNumber">Number Phone</label>
              <input type="text" id="phoneNumber" value={cvData.phoneNumber} onChange={handleInputChange} placeholder="Your Number Phone" />
            </div>

            <div className="CVECRS-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" value={cvData.location} onChange={handleInputChange} placeholder="Where are you from" />
            </div>

            <div className="CVECRS-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={cvData.email} onChange={handleInputChange} placeholder="Your email" />
            </div>

            <div className="CVECRS-group">
              <label htmlFor="references1">Reference</label>
              <input
                type="text"
                id="references1"
                value={cvData.references[0]}
                onChange={handleInputChange}
                placeholder="Your reference 1"
              />
              <input
                type="text"
                id="references2"
                value={cvData.references[1]}
                onChange={handleInputChange}
                placeholder="Your reference 2"
              />
              <input
                type="text"
                id="references3"
                value={cvData.references[2]}
                onChange={handleInputChange}
                placeholder="Your reference 3"
              />
            </div>

            <button type="submit" className="btn-save-CVECRS">Update CV</button>
          </form>
        </div>

        <div className="CVECRS-picture-wrapper">
          <div className="CVECRS-picture">
            {/* Update img src to use the avatarUrl from state */}
            <img src={cvData.avatarUrl} alt="ProfileCVECRS" />
            <button className="CVECRS-btn-edit-photo">
              <FontAwesomeIcon icon={faPencil} /> Edit Photo
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

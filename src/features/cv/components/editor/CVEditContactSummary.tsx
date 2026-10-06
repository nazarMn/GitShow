import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import type { CVRecord } from '@/shared/types/domain';
import { tw } from '@/shared/lib/tailwind';


interface CVContactForm {
  name: string;
  specialty: string;
  summary: string;
  phoneNumber: string;
  location: string;
  email: string;
  references: string[];
  avatarUrl: string;
}

export default function CVEditContRefsSummary() {
  const [cvData, setCvData] = useState<CVContactForm>({
    name: '',
    specialty: '',
    summary: '',
    phoneNumber: '',
    location: '',
    email: '',
    references: ['', '', ''],
    avatarUrl: ''
  });

  useEffect(() => {
    axios.get<CVRecord>('/api/cv')
      .then(({ data }) => {
        setCvData({
          name: data.name ?? '',
          specialty: data.specialty ?? '',
          summary: data.summary ?? '',
          phoneNumber: data.phoneNumber ?? '',
          location: data.location ?? '',
          email: data.email ?? '',
          references: data.references?.length ? data.references : ['', '', ''],
          avatarUrl: data.avatarUrl ?? '',
        });
      })
      .catch(err => console.error('Error fetching CV:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put<CVRecord>('/api/cv', cvData);
      toast.success('CV updated successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error('Failed to update CV!', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className={tw("CV-Edit-Cont-Refs-Summary")}>
      <div className={tw("CVECRS-Content")}>
        <div className={tw("CVECRS-Main")}>
          <form onSubmit={handleSubmit}>
            <div className={tw("CVECRS-group")}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={cvData.name} onChange={handleInputChange} placeholder="Your name" />
            </div>

            <div className={tw("CVECRS-group")}>
              <label htmlFor="specialty">Specialty</label>
              <input type="text" id="specialty" value={cvData.specialty} onChange={handleInputChange} placeholder="Your specialty" />
            </div>

            <div className={tw("CVECRS-group")}>
              <label htmlFor="summary">Summary</label>
              <textarea id="summary" value={cvData.summary} onChange={handleInputChange} placeholder="Tell us about yourself"></textarea>
            </div>

            <div className={tw("CVECRS-group")}>
              <label htmlFor="phoneNumber">Number Phone</label>
              <input type="text" id="phoneNumber" value={cvData.phoneNumber} onChange={handleInputChange} placeholder="Your Number Phone" />
            </div>

            <div className={tw("CVECRS-group")}>
              <label htmlFor="location">Location</label>
              <input type="text" id="location" value={cvData.location} onChange={handleInputChange} placeholder="Where are you from" />
            </div>

            <div className={tw("CVECRS-group")}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={cvData.email} onChange={handleInputChange} placeholder="Your email" />
            </div>

            <div className={tw("CVECRS-group")}>
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

            <button type="submit" className={tw("btn-save-CVECRS")}>Update CV</button>
          </form>
        </div>

        <div className={tw("CVECRS-picture-wrapper")}>
          <div className={tw("CVECRS-picture")}>
            <img src={cvData.avatarUrl} alt="ProfileCVECRS" />
            <button className={tw("CVECRS-btn-edit-photo")}>
              <FontAwesomeIcon icon={faPencil} /> Edit Photo
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

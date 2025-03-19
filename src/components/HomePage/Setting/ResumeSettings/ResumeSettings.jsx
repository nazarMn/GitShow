import React, { useState, useEffect } from 'react';
import './ResumeSettings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUser, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';

const ITEMS_PER_PAGE = 6;

export default function ResumeSettings() {
  const [formData, setFormData] = useState({ id: null, title: '', university: '', description: '' });
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleExperienceChange = (e) => {
    setYearsOfExperience(e.target.value);
  };

  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.university.trim() || !formData.description.trim()) {
      alert('All fields must be filled out before adding.');
      return;
    }

    try {
      const response = await fetch('https://gitshow.onrender.com/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newResume = await response.json();
        setItems((prev) => [...prev, newResume]);
        setFormData({ id: null, title: '', university: '', description: '' });
      } else {
        alert('Failed to add resume.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({ id: item._id, title: item.title, university: item.university, description: item.description });
    setEditing(true);
  };
  
  const handleUpdate = async () => {
    if (!formData.id) {
      alert('Resume ID is missing.');
      return;
    }
  
    if (!formData.title.trim() || !formData.university.trim() || !formData.description.trim()) {
      alert('All fields must be filled out before updating.');
      return;
    }
  
    try {
      const response = await fetch(`https://gitshow.onrender.com/api/resumes/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          university: formData.university,
          description: formData.description,
        }),
      });
  
      if (response.ok) {
        const updatedResume = await response.json();
        setItems((prev) => prev.map((item) => (item._id === updatedResume._id ? updatedResume : item)));
        setFormData({ id: null, title: '', university: '', description: '' });
        setEditing(false);
      } else {
        alert('Failed to update resume.');
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://gitshow.onrender.com/api/resumes/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Видаляємо об'єкт з локального стану
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      } else {
        alert('Failed to delete resume.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the resume.');
    }
  };
  

  const handleExperienceUpdate = async () => {
    try {
      const response = await fetch('https://gitshow.onrender.com/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ YearsOfExperience: parseInt(yearsOfExperience, 10) }),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Years of Experience Updated:', updatedUser.YearsOfExperience);
      } else {
        alert('Failed to update Years of Experience.');
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('https://gitshow.onrender.com/api/resumes', {
          credentials: 'include', // Це дозволяє передавати сесію з браузера
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched resumes:', data); // Перевіряємо отримані дані
          setItems(data);
        } else {
          console.error('Failed to fetch resumes.');
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchResumes();
  }, []);







  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://gitshow.onrender.com/api/user', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setYearsOfExperience(userData.YearsOfExperience || ''); // Set YearsOfExperience
        } else {
          console.error('Failed to fetch user data.');
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserData();
  }, []);
  
  

  return (
    <div className="resume-settings-container">

      <SettingsSidebar />
   
      <div className="resume-settings">
        <h1>Resume</h1>
        <div className="resume-form">
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title (e.g., Software Engineer)"
          />
          <input
            type="text"
            id="university"
            value={formData.university}
            onChange={handleInputChange}
            placeholder="University/Company and Years"
          />
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
          ></textarea>
          <button
            className="btn-save"
            onClick={editing ? handleUpdate : handleAdd}
          >
            {editing ? 'Update' : 'Add'}
          </button>
        </div>
        <div className="resume-experience">
          <input
            type="number"
            id="yearsOfExperience"
            value={yearsOfExperience}
            onChange={handleExperienceChange}
            placeholder="Years of Experience"
          />
          <button
            className="btn-update-experience"
            onClick={handleExperienceUpdate}
          >
            Update
          </button>
        </div>
        <div className="resume-list">
  {paginatedItems.length > 0 ? (
    paginatedItems.map((item) => (
      <div key={item._id} className="resume-card">
        <h3>{item.title}</h3>
        <p className="university">{item.university}</p>
        <p className="description">{item.description}</p>
        <div className="card-actions">
          <button className="btn-edit" onClick={() => handleEdit(item)}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
          <button className="btn-delete" onClick={() => handleDelete(item._id)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p>No resumes found.</p>
  )}
</div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

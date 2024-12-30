import React, { useState } from 'react';
import './ResumeSettings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUser, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';

const ITEMS_PER_PAGE = 6;

export default function ResumeSettings() {
  const [items, setItems] = useState([
    { id: 1, title: 'Computer Science', university: 'Cambridge University / 2005 - 2008', description: 'Studied algorithms, data structures, and computer architecture.' },
    { id: 2, title: 'Software Engineer', university: 'Google / 2009 - 2015', description: 'Developed scalable backend systems and optimized performance.' },
    { id: 3, title: 'Frontend Developer', university: 'Meta / 2016 - 2020', description: 'Built modern web interfaces using React and TypeScript.' },
    { id: 4, title: 'Backend Developer', university: 'Amazon / 2021 - Present', description: 'Designed and implemented RESTful APIs and microservices.' },
    { id: 5, title: 'DevOps Engineer', university: 'Netflix / 2022 - Present', description: 'Streamlined CI/CD pipelines and enhanced deployment workflows.' },
  ]);

  const [formData, setFormData] = useState({ id: null, title: '', university: '', description: '' });
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = () => {
    setItems((prev) => [...prev, { ...formData, id: Date.now() }]);
    setFormData({ id: null, title: '', university: '', description: '' });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(true);
  };

  const handleUpdate = () => {
    setItems((prev) => prev.map((item) => (item.id === formData.id ? formData : item)));
    setFormData({ id: null, title: '', university: '', description: '' });
    setEditing(false);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="resume-settings-container">
      <div className="settings-sidebar">
        <nav>
          <ul>
            <li className="active">
              <FontAwesomeIcon icon={faUser} /> Public profile
            </li>
            <li>
              <FontAwesomeIcon icon={faFileLines} /> Resume
            </li>
            <li>
              <FontAwesomeIcon icon={faBrain} /> Skills
            </li>
          </ul>
        </nav>
      </div>
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
        <div className="resume-list">
          {paginatedItems.map((item) => (
            <div key={item.id} className="resume-card">
              <h3>{item.title}</h3>
              <p className="university">{item.university}</p>
              <p className="description">{item.description}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(item)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          ))}
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
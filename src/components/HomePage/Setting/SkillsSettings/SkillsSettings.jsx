import React, { useState, useEffect } from "react";
import "./SkillsSettings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faUser, faFileLines, faBrain } from "@fortawesome/free-solid-svg-icons";
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";

const ITEMS_PER_PAGE = 6;

export default function SkillsSettings() {
  const [formDataSkill, setFormDataSkill] = useState({ idSkill: null, titleSkill: '', descriptionSkill: '' });
  const [editingSkill, setEditingSkill] = useState(false);
  const [currentPageSkill, setCurrentPageSkill] = useState(1);
  const [itemsSkill, setItemsSkill] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChangeSkill = (e) => {
    const { id, value } = e.target;
    setFormDataSkill((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddSkill = async () => {
    if (!formDataSkill.titleSkill.trim() || !formDataSkill.descriptionSkill.trim()) {
      alert('All fields must be filled out before adding.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataSkill),
      });

      if (response.ok) {
        const newSkills = await response.json();
        setItemsSkill((prev) => [...prev, newSkills]);
        setFormDataSkill({ idSkill: null, titleSkill: '', descriptionSkill: '' });
      } else {
        alert('Failed to add skills.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSkill = (item) => {
    setFormDataSkill({ idSkill: item._id, titleSkill: item.titleSkill, descriptionSkill: item.descriptionSkill });
    setEditingSkill(true);
  };

  const handleUpdateSkill = async () => {
    if (!formDataSkill.idSkill) {
      alert('Skills ID is missing.');
      return;
    }
  
    if (!formDataSkill.titleSkill.trim() || !formDataSkill.descriptionSkill.trim()) {
      alert('All fields must be filled out before updating.');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/skills/${formDataSkill.idSkill}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleSkill: formDataSkill.titleSkill,
          descriptionSkill: formDataSkill.descriptionSkill,
        }),
      });
      
  
      if (response.ok) {
        const updatedSkills = await response.json();
        setItemsSkill((prev) => prev.map((item) => (item._id === updatedSkills._id ? updatedSkills : item)));
        setFormDataSkill({ idSkill: null, titleSkill: '', descriptionSkill: '' });
        setEditingSkill(false);
      } else {
        alert('Failed to update skills.');
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleDeleteSkill = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItemsSkill((prevItems) => prevItems.filter((item) => item._id !== id));
      } else {
        alert('Failed to delete skills.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the skills.');
    }
  };

  const totalPagesSkill = Math.ceil(itemsSkill.length / ITEMS_PER_PAGE);

  const paginatedItemsSkill = itemsSkill.slice(
    (currentPageSkill - 1) * ITEMS_PER_PAGE,
    currentPageSkill * ITEMS_PER_PAGE
  );

  const handlePageChangeSkill = (newPage) => {
    setCurrentPageSkill(newPage);
  };

  useEffect(() => {
    const fetchSkillsSkill = async () => {
      try {
        const response = await fetch(`${API_URL}/api/skills`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setItemsSkill(data);
        } else {
          console.error('Failed to fetch skills.');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSkillsSkill();
  }, []);

  return (
    <div className="skillsSettingsContainer">

      <SettingsSidebar />
      

      <div className="skills-settings">
        <h1>Skills</h1>

        <div className="skills-form">
        <input
  type="text"
  id="titleSkill"
  value={formDataSkill.titleSkill}
  onChange={handleInputChangeSkill}
  placeholder="Skill Name"
/>

<textarea
  placeholder="Description of the skill"
  id="descriptionSkill"
  value={formDataSkill.descriptionSkill}
  onChange={handleInputChangeSkill}
/>

  <button
    className="btn-save"
    onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
  >
    {editingSkill ? 'Update' : 'Add'}
  </button>
</div>


        <div className="skills-list">
          {paginatedItemsSkill.length > 0 ? (
            paginatedItemsSkill.map((item) => (
              <div className="skills-card" key={item._id}>
                <h3>{item.titleSkill}</h3>
                <p className="description">{item.descriptionSkill}</p>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEditSkill(item)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteSkill(item._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No skills found.</p>
          )}
        </div>

        <div className="pagination">
          {[...Array(totalPagesSkill)].map((_, index) => (
            <button
              key={index}
              className={currentPageSkill === index + 1 ? "active" : ""}
              onClick={() => handlePageChangeSkill(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

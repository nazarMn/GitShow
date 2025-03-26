import React, { useState, useEffect } from "react";
import "./SkillsSettings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  

const ITEMS_PER_PAGE = 6;

export default function SkillsSettings() {
  const [formDataSkill, setFormDataSkill] = useState({ idSkill: null, titleSkill: '', descriptionSkill: '' });
  const [editingSkill, setEditingSkill] = useState(false);
  const [currentPageSkill, setCurrentPageSkill] = useState(1);
  const [itemsSkill, setItemsSkill] = useState([]);

  const handleInputChangeSkill = (e) => {
    const { id, value } = e.target;
    setFormDataSkill((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddSkill = async () => {
    if (!formDataSkill.titleSkill.trim() || !formDataSkill.descriptionSkill.trim()) {
      toast.error('All fields must be filled out before adding.');
      return;
    }

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataSkill),
      });

      if (response.ok) {
        const newSkills = await response.json();
        setItemsSkill((prev) => [...prev, newSkills]);
        setFormDataSkill({ idSkill: null, titleSkill: '', descriptionSkill: '' });
        toast.success("Skill added successfully!");
      } else {
        toast.error('Failed to add skill.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while adding the skill.');
    }
  };

  const handleEditSkill = (item) => {
    setFormDataSkill({ idSkill: item._id, titleSkill: item.titleSkill, descriptionSkill: item.descriptionSkill });
    setEditingSkill(true);
  };

  const handleUpdateSkill = async () => {
    if (!formDataSkill.idSkill) {
      toast.error('Skills ID is missing.');
      return;
    }
  
    if (!formDataSkill.titleSkill.trim() || !formDataSkill.descriptionSkill.trim()) {
      toast.error('All fields must be filled out before updating.');
      return;
    }
  
    try {
      const response = await fetch(`/api/skills/${formDataSkill.idSkill}`, {
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
        toast.success("Skill updated successfully!");
      } else {
        toast.error('Failed to update skill.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating the skill.');
    }
  };
  

  const handleDeleteSkill = (id) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete this skill?</p>
        <button
          onClick={() => {
            confirmDelete(id, toastId);
          }}
          className="btn-confirm"
        >
          Yes
        </button>
        <button onClick={() => toast.dismiss(toastId)} className="btn-cancel">
          No
        </button>
      </div>,
      { position: "top-center", autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async (id, toastId) => {
    toast.dismiss(toastId); // Close the confirmation toast before deleting

    try {
      const response = await fetch(`/api/skills/${id}`, { method: "DELETE" });

      if (response.ok) {
        setItemsSkill((prevItems) => prevItems.filter((item) => item._id !== id));
        toast.success("Skill deleted successfully!", { position: "top-right" });
      } else {
        toast.error("Failed to delete skill.", { position: "top-right" });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the skill.", { position: "top-right" });
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
        const response = await fetch('/api/skills', {
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


  const handleGoHome = () => {
    window.location.href = '/home'; // Перенаправлення на сторінку home
  };
  
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
        <ToastContainer />
        <FontAwesomeIcon icon={faTimes} className="btn-go-home" onClick={handleGoHome}/>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./SkillsSettings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileLines, faBrain, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SkillsSettings() {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ id: null, name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 6;

  const handleAddOrUpdate = () => {
    if (currentSkill.name && currentSkill.description) {
      if (currentSkill.id) {
        setSkills((prevSkills) =>
          prevSkills.map((skill) =>
            skill.id === currentSkill.id ? currentSkill : skill
          )
        );
      } else {
        setSkills([...skills, { ...currentSkill, id: Date.now() }]);
      }
      setCurrentSkill({ id: null, name: "", description: "" });
    }
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
  };

  const handleDelete = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * skillsPerPage;
  const displayedSkills = skills.slice(startIndex, startIndex + skillsPerPage);
  const totalPages = Math.ceil(skills.length / skillsPerPage);

  return (
    <div className="skillsSettingsContainer">
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

      <div className="skills-settings">
        <h1>Skills</h1>

        <div className="skills-form">
          <input
            type="text"
            id="skillName"
            placeholder="Skill Name"
            value={currentSkill.name}
            onChange={(e) =>
              setCurrentSkill({ ...currentSkill, name: e.target.value })
            }
          />
          <textarea
            id="skillDescription"
            placeholder="Description of the skill"
            value={currentSkill.description}
            onChange={(e) =>
              setCurrentSkill({ ...currentSkill, description: e.target.value })
            }
          ></textarea>
          <button
            className="btn-save"
            onClick={handleAddOrUpdate}
          >
            {currentSkill.id ? "Update" : "Add"}
          </button>
        </div>

        <div className="skills-list">
          {displayedSkills.map((skill) => (
            <div className="skills-card" key={skill.id}>
              <h3>{skill.name}</h3>
              <p className="description">{skill.description}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(skill)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(skill.id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
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

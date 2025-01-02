import React, { useState, useEffect } from "react";
import "./SkillsSettings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileLines, faBrain, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SkillsSettings() {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ id: null, name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 6;
  const [user, setUser] = useState(null);

  // Fetch current user data
  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Fetch skills for the current user
  useEffect(() => {
    if (user) {
      fetch(`/api/skills?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => setSkills(data))
        .catch((error) => console.error("Error fetching skills:", error));
    }
  }, [user]);

  // Handle add or update skill
  const handleAddOrUpdate = () => {
    if (currentSkill.name && currentSkill.description) {
      const method = currentSkill.id ? "PUT" : "POST";
      const url = currentSkill.id ? `/api/skills/${currentSkill.id}` : "/api/skills";

      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentSkill, userId: user.id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (currentSkill.id) {
            setSkills((prevSkills) =>
              prevSkills.map((skill) => (skill.id === data.id ? data : skill))
            );
          } else {
            setSkills([...skills, data]);
          }
          setCurrentSkill({ id: null, name: "", description: "" });
        })
        .catch((error) => console.error("Error saving skill:", error));
    }
  };

  // Handle edit skill
  const handleEdit = (skill) => {
    setCurrentSkill(skill);
  };

  // Handle delete skill
  const handleDelete = (id) => {
    fetch(`/api/skills/${id}`, { method: "DELETE" })
      .then(() => setSkills(skills.filter((skill) => skill.id !== id)))
      .catch((error) => console.error("Error deleting skill:", error));
  };

  // Pagination logic
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

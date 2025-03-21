import React, { useEffect, useState } from 'react';
import './Portfolio.css';
import PortfolioWorks from '../PortfolioWorks/PortfolioWorks';
import PortfolioCard from '../PortfolioCard/PortfolioCard';
import axios from 'axios';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); 
  const [currentProject, setCurrentProject] = useState(null); 
  const projectsPerPageFirst = 2; // Кількість проектів на першій сторінці
  const projectsPerPageOther = 4; // Кількість проектів на інших сторінках

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://gitshow.onrender.com/api/projects/home');
        // Перевірка на масив
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          console.error('Received data is not an array');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Логіка для кількості проектів на поточній сторінці
  const projectsPerPage = currentPage === 1 ? projectsPerPageFirst : projectsPerPageOther;

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  // Для першої сторінки відображаються перші 2 проекти, на наступних - по 4
  let currentProjects = [];

  if (currentPage === 1) {
    currentProjects = projects.slice(0, projectsPerPageFirst);
  } else {
    const remainingProjects = projects.slice(projectsPerPageFirst);
    currentProjects = remainingProjects.slice((currentPage - 2) * projectsPerPageOther, (currentPage - 1) * projectsPerPageOther);
  }

  const totalPages = Math.ceil((projects.length - projectsPerPageFirst) / projectsPerPageOther) + 1; 

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`https://gitshow.onrender.com/api/projects/${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openEditModal = (project) => {
    setCurrentProject(project); 
    setShowModal(true); 
  };

  const closeEditModal = () => {
    setShowModal(false);
    setCurrentProject(null);
  };

  const handleEditProject = async () => {
    try {
      const formData = new FormData();
      formData.append('name', currentProject.name);
      formData.append('description', currentProject.description);
      formData.append('websiteUrl', currentProject.websiteUrl);
      if (currentProject.image) {
        formData.append('image', currentProject.image);
      }
  
      const response = await axios.put(`https://gitshow.onrender.com/api/projects/${currentProject._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setProjects(projects.map((project) =>
        project._id === currentProject._id ? response.data : project
      ));
      closeEditModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="portfolio">
      <div className="portfolioTop">
        <h3>PORTFOLIO</h3>
        <h2>Completed Works</h2>
      </div>

      <div className="portfolioBottom">
        {currentPage === 1 && (
          <div className="portfolioRow">
            <div className="portfolioWorksAndCard">
              <PortfolioWorks />
            </div>
          </div>
        )}
        
        <div className="portfolioGrid">
          {Array.isArray(currentProjects) && currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <PortfolioCard
                key={project._id}
                title={project.name}
                description={project.description}
                imageUrl={project.imageUrl}
                link={project.link}
                websiteUrl={project.websiteUrl}
                onDelete={() => deleteProject(project._id)}
                onEdit={() => openEditModal(project)} 
              />
            ))
          ) : (
            <p>No projects available to display.</p>
          )}
        </div>
      </div>

      {/* Модалка для редагування */}
      {showModal && (
        <div className="modal">
          <div className="modalContent">
            <h3>Edit Project</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={currentProject.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={currentProject.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Website URL:
              <input
                type="text"
                name="websiteUrl"
                value={currentProject.websiteUrl}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Image:
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.files[0] })}
              />
            </label>
            <div className="modalActions">
              <button onClick={handleEditProject} >Save Changes</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
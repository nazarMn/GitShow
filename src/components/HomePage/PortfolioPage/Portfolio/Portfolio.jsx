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
  const projectsPerPage = currentPage === 1 ? 3 : 4;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = currentPage === 1 ? 0 : indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil((projects.length + 1) / projectsPerPage); 

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
      await axios.delete(`/api/projects/${projectId}`);
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
  
      const response = await axios.put(`/api/projects/${currentProject._id}`, formData, {
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
        {currentPage === 1 ? (
          <>
            <div className="portfolioRow">
              <div className="portfolioWorksAndCard">
                <PortfolioWorks />
                {currentProjects[0] && (
                  <PortfolioCard
                    key={currentProjects[0]._id}
                    title={currentProjects[0].name}
                    description={currentProjects[0].description}
                    imageUrl={currentProjects[0].imageUrl}
                    link={currentProjects[0].link}
                    websiteUrl={currentProjects[0].websiteUrl}
                    onDelete={() => deleteProject(currentProjects[0]._id)}
                    onEdit={() => openEditModal(currentProjects[0])} 
                  />
                )}
              </div>
            </div>
            <div className="portfolioGrid">
              {currentProjects.slice(1).map((project) => (
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
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="portfolioGrid">
              {currentProjects.map((project) => (
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
              ))}
            </div>
          </>
        )}
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
        <button onClick={handleEditProject}>Save Changes</button>
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

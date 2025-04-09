import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PortfolioPage.css';

import PortfolioWorks from '../../../componentsProfilePage/BoxPortfolioPage/PortfolioWorks/PortfolioWorks';
import PortfolioGrid from '../../../componentsProfilePage/BoxPortfolioPage/PortfolioGrid/PortfolioGrid';
import EditProjectModal from '../../../componentsProfilePage/BoxPortfolioPage/EditProjectModal/EditProjectModal';
import Pagination from '../../../componentsProfilePage/PaginationButton/PaginationButton';

import axios from 'axios';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const projectsPerPageFirst = 2;
  const projectsPerPageOther = 4;
  const projectsPerPage = currentPage === 1 ? projectsPerPageFirst : projectsPerPageOther;

  const totalPages = Math.ceil((projects.length - projectsPerPageFirst) / projectsPerPageOther) + 1;

  const currentProjects = currentPage === 1
    ? projects.slice(0, projectsPerPageFirst)
    : projects.slice(projectsPerPageFirst).slice((currentPage - 2) * projectsPerPageOther, (currentPage - 1) * projectsPerPageOther);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects/home');
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = (id) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete this project?</p>
        <button onClick={() => confirmDelete(id, toastId)} className="btn-confirm">Yes</button>
        <button onClick={() => toast.dismiss(toastId)} className="btn-cancel">No</button>
      </div>,
      { position: "top-center", autoClose: false }
    );
  };

  const confirmDelete = async (id, toastId) => {
    toast.dismiss(toastId);
    try {
      const response = await axios.delete(`/api/projects/${id}`);
      if (response.status === 200) {
        setProjects(projects.filter(project => project._id !== id));
        toast.success("Project deleted successfully!", { position: "top-right" });
      }
    } catch {
      toast.error("Failed to delete project.", { position: "top-right" });
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProjects(projects.map(project => project._id === currentProject._id ? response.data : project));
      closeEditModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="portfolio">
      <div className="portfolioTop">
        <h3>PORTFOLIO</h3>
        <h2>Completed Works</h2>
      </div>

      <div className="portfolioBottom">
        {currentPage === 1 &&
        <div className="portfolioWorksWrapper"> <PortfolioWorks />
         </div>
         }
        <PortfolioGrid
          projects={currentProjects}
          onDelete={handleDelete}
          onEdit={openEditModal}
        />
      </div>

      {showModal && (
        <EditProjectModal
          currentProject={currentProject}
          onClose={closeEditModal}
          onSave={handleEditProject}
          onInputChange={handleInputChange}
          setCurrentProject={setCurrentProject}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={() => setCurrentPage(p => p + 1)}
        onPrev={() => setCurrentPage(p => p - 1)}
      />

      <ToastContainer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import type { ProjectRecord } from '@/shared/types/domain';
import { toast } from 'react-toastify';

import PortfolioWorks from "@/features/profile/components/portfolio/PortfolioWorks";
import PortfolioGrid from "@/features/profile/components/portfolio/PortfolioGrid";
import EditProjectModal from "@/features/profile/components/portfolio/EditProjectModal";
import Pagination from "@/shared/components/Pagination";

interface EditableProject extends ProjectRecord {
  _id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

import axios from 'axios';
import { tw } from '@/shared/lib/tailwind';


export default function Portfolio() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<EditableProject | null>(null);


  const projectsPerPageFirst = 2;
  const projectsPerPageOther = 4;

  const totalPages = Math.ceil((projects.length - projectsPerPageFirst) / projectsPerPageOther) + 1;

  const currentProjects = currentPage === 1
    ? projects.slice(0, projectsPerPageFirst)
    : projects.slice(projectsPerPageFirst).slice((currentPage - 2) * projectsPerPageOther, (currentPage - 1) * projectsPerPageOther);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<ProjectRecord[]>('/api/projects/home');
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = (id: string) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete this project?</p>
        <button onClick={() => confirmDelete(id, toastId)} className={tw("btn-confirm")}>Yes</button>
        <button onClick={() => toast.dismiss(toastId)} className={tw("btn-cancel")}>No</button>
      </div>,
      { position: "top-center", autoClose: false }
    );
  };

  const confirmDelete = async (id: string, toastId: string | number) => {
    toast.dismiss(toastId);
    try {
      const response = await axios.delete<{ message: string }>(`/api/projects/${id}`);
      if (response.status === 200) {
        setProjects((previousProjects) => previousProjects.filter((project) => project._id !== id));
        toast.success("Project deleted successfully!", { position: "top-right" });
      }
    } catch {
      toast.error("Failed to delete project.", { position: "top-right" });
    }
  };

  const openEditModal = (project: ProjectRecord) => {
    if (!project._id) return;
    setCurrentProject({
      ...project,
      _id: project._id,
      name: project.name ?? project.title ?? '',
      description: project.description ?? '',
      websiteUrl: project.websiteUrl ?? '',
    });
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setCurrentProject(null);
  };

  const handleEditProject = async () => {
    if (!currentProject) return;

    try {
      const formData = new FormData();
      formData.append('name', currentProject.name);
      formData.append('description', currentProject.description);
      formData.append('websiteUrl', currentProject.websiteUrl);
      if (currentProject.image) {
        formData.append('image', currentProject.image);
      }

      const response = await axios.put<ProjectRecord>(`/api/projects/${currentProject._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProjects((previousProjects) => previousProjects.map((project) => project._id === currentProject._id ? response.data : project));
      closeEditModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleInputChange = (e: { target: { name: string; value: string | File | undefined } }) => {
    const { name, value } = e.target;
    setCurrentProject((previousProject) => previousProject ? { ...previousProject, [name]: value } : previousProject);
  };


  return (
    <div className={tw("portfolio")}>
      <div className={tw("portfolioTop")}>
        <h3>PORTFOLIO</h3>
        <h2>Completed Works</h2>
      </div>

      <div className={tw("portfolioBottom")}>
        {currentPage === 1 &&
        <div className={tw("portfolioWorksWrapper")}> <PortfolioWorks />
         </div>
         }
        <PortfolioGrid
          projects={currentProjects}
          onDelete={handleDelete}
          onEdit={openEditModal}
        />
      </div>

      {showModal && currentProject && (
        <EditProjectModal
          project={currentProject}
          onClose={closeEditModal}
          onSave={handleEditProject}
          onChange={handleInputChange}
        />
      )}

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
    </div>
  );
}

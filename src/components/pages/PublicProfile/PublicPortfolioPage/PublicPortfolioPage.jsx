import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PublicPortfolioPage.css';
import PortfolioGrid from '../../../componentsProfilePage/BoxPortfolioPage/PortfolioGrid/PortfolioGrid';
import Pagination from '../../../componentsProfilePage/PaginationButton/PaginationButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);


  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <p className="loading">Loading projects...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="portfolio">
      <div className="portfolioTop">
        <h3>PORTFOLIO</h3>
        <h2>Completed Works</h2>
      </div>

      <PortfolioGrid projects={currentProjects}/>

        <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={(page) => setCurrentPage(page)}
           />

      <ToastContainer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import type { ProjectRecord } from '@/shared/types/domain';
import { readJson } from '@/shared/lib/http';
import { useParams } from 'react-router-dom';
import PortfolioGrid from "@/features/profile/components/portfolio/PortfolioGrid";
import Pagination from "@/shared/components/Pagination";
import { ToastContainer } from 'react-toastify';
import { tw } from '@/shared/lib/tailwind';


export default function PublicPortfolio() {
  const { userId } = useParams();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await readJson<ProjectRecord[]>(response);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
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

  if (loading) return <p className={tw("loading")}>Loading projects...</p>;
  if (error) return <p className={tw("error")}>Error: {error}</p>;

  return (
    <div className={tw("portfolio")}>
      <div className={tw("portfolioTop")}>
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

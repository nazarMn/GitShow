import React, { useEffect, useState } from 'react';
import './Portfolio.css';
import PortfolioWorks from '../PortfolioWorks/PortfolioWorks';
import PortfolioCard from '../PortfolioCard/PortfolioCard';
import axios from 'axios';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    />
  ))}
</div>

    </>
  )}
</div>


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

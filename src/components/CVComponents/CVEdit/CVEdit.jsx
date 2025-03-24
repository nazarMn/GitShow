import React, { useState } from 'react';
import './CVEdit.css';
import CVEditContRefsSummary from '.././CVEditСontainer/CVEditContRefsSummary/CVEditContRefsSummary';
import SettingsSidebar from '../../HomePage/Setting/SettingsSidebar/SettingsSidebar';
import CVEditEduSkills from '.././CVEditСontainer/CVEditEduSkills/CVEditEduSkills';
import CVEditExp from '.././CVEditСontainer/CVEditExp/CVEditExp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function CVEdit() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <CVEditContRefsSummary />;
      case 2:
        return <CVEditEduSkills />;
      case 3:
        return <CVEditExp />;
      default:
        return <CVEditContRefsSummary />;
    }
  };


  const handleGoHome = () => {
    window.location.href = '/home'; // Перенаправлення на сторінку home
  };
  
  return (
    <div className="CV-Edit">
      <SettingsSidebar />
      <div className="CV-Edit-Main">
        {renderPage()}
        
        <div className="CV-Edit-Pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            ❮
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button 
                key={page} 
                className={currentPage === page ? "active" : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}

          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            ❯
          </button>
        </div>

         <FontAwesomeIcon icon={faTimes} className="btn-go-home" onClick={handleGoHome}/> 
      </div>
    </div>
  );
}

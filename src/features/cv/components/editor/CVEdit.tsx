import React, { useState } from 'react';
import CVEditContRefsSummary from "@/features/cv/components/editor/CVEditContactSummary";
import SettingsSidebar from "@/features/settings/components/SettingsSidebar";
import CVEditEduSkills from "@/features/cv/components/editor/CVEditEducationSkills";
import CVEditExp from "@/features/cv/components/editor/CVEditExperience";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { tw } from '@/shared/lib/tailwind';


export default function CVEdit() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handlePageChange = (page: number) => {
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
    window.location.href = '/home';
  };

  return (
    <div className={tw("CV-Edit")}>
      <SettingsSidebar hasCV />
      <div className={tw("CV-Edit-Main")}>
        {renderPage()}

        <div className={tw("CV-Edit-Pagination")}>
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
                className={tw(currentPage === page ? "active" : "")}
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

         <FontAwesomeIcon icon={faTimes} className={tw("btn-go-home")} onClick={handleGoHome}/>
      </div>
    </div>
  );
}

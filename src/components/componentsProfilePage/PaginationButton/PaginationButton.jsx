import React from 'react';

import './PaginationButton.css';

export default function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={currentPage === 1}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={onNext} disabled={currentPage === totalPages}>Next</button>
    </div>
  );
}

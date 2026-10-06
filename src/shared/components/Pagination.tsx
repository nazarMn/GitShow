import React from 'react';
import { tw } from '@/shared/lib/tailwind';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  // Розрахунок видимого діапазону сторінок
  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      end = Math.min(totalPages, start + 2);
    }

    if (currentPage === totalPages) {
      start = Math.max(1, end - 2);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getPageNumbers();

  return (
    <footer className={tw(`pagination ${className}`.trim())}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={tw(currentPage === page ? 'active' : '')}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </footer>
  );
}

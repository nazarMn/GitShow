import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PublicResumePage.css';
import ResumeHeader from '../../../componentsProfilePage/BoxResumePage/ResumeHeader/ResumeHeader';
import ResumeList from '../../../componentsProfilePage/BoxResumePage/ResumeList/ResumeList';
import Pagination from '../../../componentsProfilePage/PaginationButton/PaginationButton';

export default function Resume() {
  const [items, setItems] = useState([]);
  const [yearsOfExperience, setYearsOfExperience] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();


  const itemsPerPage = 5;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/${userId}/resume`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch resumes');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchResumes();
  }, [userId]);

 useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setYearsOfExperience(userData.YearsOfExperience || 0);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentPageSafe = Math.min(currentPage, totalPages || 1);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="resume-container">
      <ResumeHeader years={yearsOfExperience} />
      <ResumeList items={currentItems} loading={loading} error={error} />
      {totalPages > 1 && (
      <Pagination 
      className="pagination"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      )}
    </div>
  );
}

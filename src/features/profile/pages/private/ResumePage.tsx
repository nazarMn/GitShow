import React, { useState, useEffect } from 'react';
import type { ResumeRecord } from '@/shared/types/domain';
import type { ExperienceResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import ResumeHeader from "@/features/profile/components/resume/ResumeHeader";
import ResumeList from "@/features/profile/components/resume/ResumeList";
import Pagination from "@/shared/components/Pagination";
import { tw } from '@/shared/lib/tailwind';


export default function Resume() {
  const [items, setItems] = useState<ResumeRecord[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/resumes', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch resumes');
        const data = await readJson<ResumeRecord[]>(response);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await readJson<ExperienceResponse>(response);
        setYearsOfExperience(Number(userData.YearsOfExperience ?? 0));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentPageSafe = Math.min(currentPage, totalPages || 1);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={tw("resume-container")}>
      <ResumeHeader years={yearsOfExperience} />
      <ResumeList items={currentItems} loading={loading} error={error} />
      {totalPages > 1 && (
      <Pagination
      className={tw("pagination")}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      )}
    </div>
  );
}

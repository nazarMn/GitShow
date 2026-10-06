import React, { useState, useEffect } from 'react';
import type { ResumeRecord, UserProfile } from '@/shared/types/domain';
import type { ExperienceResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes ,faUser, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import SettingsSidebar from "@/features/settings/components/SettingsSidebar";
import { toast, type Id } from 'react-toastify';
import { tw } from '@/shared/lib/tailwind';


const ITEMS_PER_PAGE = 6;

export default function ResumeSettings() {
  const [formData, setFormData] = useState<{ id: string | null; title: string; university: string; description: string }>({ id: null, title: '', university: '', description: '' });
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<ResumeRecord[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearsOfExperience(e.target.value);
  };

  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.university.trim() || !formData.description.trim()) {
      toast.error('All fields must be filled out before adding.');
      return;
    }

    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newResume = await readJson<ResumeRecord>(response);
        setItems((prev) => [...prev, newResume]);
        setFormData({ id: null, title: '', university: '', description: '' });
        toast.success('Resume added successfully!');
      } else {
        toast.error('Failed to add resume.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while adding the resume.');
    }
  };

  const handleEdit = (item: ResumeRecord) => {
    setFormData({ id: item._id ?? null, title: item.title ?? '', university: item.university ?? '', description: item.description ?? '' });
    setEditing(true);
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      toast.error('Resume ID is missing.');
      return;
    }

    if (!formData.title.trim() || !formData.university.trim() || !formData.description.trim()) {
      toast.error('All fields must be filled out before updating.');
      return;
    }

    try {
      const response = await fetch(`/api/resumes/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          university: formData.university,
          description: formData.description,
        }),
      });

      if (response.ok) {
        const updatedResume = await readJson<ResumeRecord>(response);
        setItems((prev) => prev.map((item) => (item._id === updatedResume._id ? updatedResume : item)));
        setFormData({ id: null, title: '', university: '', description: '' });
        setEditing(false);
        toast.success('Resume updated successfully!');
      } else {
        toast.error('Failed to update resume.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating the resume.');
    }
  };

  const handleDelete = (id: string) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete this resume?</p>
        <button
          onClick={() => {
            confirmDelete(id, toastId);
          }}
          className={tw("btn-confirm")}
        >
          Yes
        </button>
        <button onClick={() => toast.dismiss(toastId)} className={tw("btn-cancel")}>
          No
        </button>
      </div>,
      { position: "top-center", autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async (id: string, toastId: Id) => {
    toast.dismiss(toastId); // Закриваємо toast перед видаленням

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        toast.success('Resume deleted successfully!', { position: "top-right" });
      } else {
        toast.error('Failed to delete resume.', { position: "top-right" });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the resume.', { position: "top-right" });
    }
  };

  const handleExperienceUpdate = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ YearsOfExperience: parseInt(yearsOfExperience, 10) }),
      });

      if (response.ok) {
        const updatedUser = await readJson<UserProfile>(response);
        toast.success('Years of Experience updated successfully!');
      } else {
        toast.error('Failed to update Years of Experience.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating the Years of Experience.');
    }
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/resumes', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await readJson<ResumeRecord[]>(response);
          setItems(data);
        } else {
          toast.error('Failed to fetch resumes.');
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while fetching resumes.');
      }
    };

    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await readJson<ExperienceResponse>(response);
          setYearsOfExperience(String(userData.YearsOfExperience ?? ''));
        } else {
          toast.error('Failed to fetch user data.');
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []);

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className={tw("resume-settings-container")}>
      <SettingsSidebar />
      <div className={tw("resume-settings")}>
        <h1>Resume</h1>
        <div className={tw("resume-form")}>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title (e.g., Software Engineer)"
          />
          <input
            type="text"
            id="university"
            value={formData.university}
            onChange={handleInputChange}
            placeholder="University/Company and Years"
          />
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
          ></textarea>
          <button
            className={tw("btn-save")}
            onClick={editing ? handleUpdate : handleAdd}
          >
            {editing ? 'Update' : 'Add'}
          </button>
        </div>
        <div className={tw("resume-experience")}>
          <input
            type="number"
            id="yearsOfExperience"
            value={yearsOfExperience}
            onChange={handleExperienceChange}
            placeholder="Years of Experience"
          />
          <button
            className={tw("btn-update-experience")}
            onClick={handleExperienceUpdate}
          >
            Update
          </button>
        </div>
        <div className={tw("resume-list")}>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <div key={item._id} className={tw("resume-card")}>
                <h3>{item.title}</h3>
                <p className={tw("university")}>{item.university}</p>
                <p className={tw("description")}>{item.description}</p>
                <div className={tw("card-actions")}>
                  <button className={tw("btn-edit")} onClick={() => handleEdit(item)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className={tw("btn-delete")} onClick={() => { if (item._id) handleDelete(item._id); }}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No resumes found.</p>
          )}
        </div>
        <div className={tw("pagination")}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={tw(currentPage === index + 1 ? 'active' : '')}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <FontAwesomeIcon icon={faTimes} className={tw("btn-go-home")} onClick={handleGoHome} />
      </div>
    </div>
  );
}

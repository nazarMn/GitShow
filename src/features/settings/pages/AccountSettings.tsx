import React, { useState, useEffect } from 'react';
import type { UserProfile } from '@/shared/types/domain';
import type { AvatarUploadResponse } from '@/shared/types/api';
import { readJson } from '@/shared/lib/http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faLink, faTimes, faFileLines, faBrain } from '@fortawesome/free-solid-svg-icons';
import SettingsSidebar from "@/features/settings/components/SettingsSidebar";
import { ToastContainer, toast } from 'react-toastify';
import { tw } from '@/shared/lib/tailwind';


export default function AccountSettings() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    company: '',
    location: '',
    email: '',
    instagram: '',
    twitter: '',
    facebook: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/user')
      .then((res) => readJson<UserProfile>(res))
      .then((data) => {
        setUser(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          company: data.company || '',
          location: data.location || '',
          email: data.email || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
          facebook: data.facebook || '',
        });
      })
      .catch(() => setUser(null));
  }, []);

  const validateField = (id: string, value: string) => {
    let error = '';

    if (id === 'instagram' && value) {
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
      if (!instagramRegex.test(value)) {
        error = 'Please enter a valid Instagram URL.';
      }
    }

    if (id === 'twitter' && value) {
      const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
      if (!twitterRegex.test(value)) {
        error = 'Please enter a valid Twitter URL.';
      }
    }

    if (id === 'facebook' && value) {
      const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;
      if (!facebookRegex.test(value)) {
        error = 'Please enter a valid Facebook URL.';
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: error,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    validateField(id, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => readJson<UserProfile>(res))
      .then((updatedUser: UserProfile) => {
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
      })
      .catch((err) => toast.error('Error updating profile'));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    fetch('/api/upload-avatar', {
      method: 'POST',
      body: formData,
    })
      .then((res) => readJson<AvatarUploadResponse>(res))
      .then((data: AvatarUploadResponse) => {
        if (data.avatarUrl) {
          setUser((previousUser) => previousUser ? { ...previousUser, avatarUrl: data.avatarUrl } : previousUser);
          toast.success('Avatar uploaded successfully!');
        }
      })
      .catch(() => toast.error('Error uploading avatar'));
  };

  const handleGoHome = () => {
    window.location.href = '/home';
  };

  return (
    <div className={tw("account-settings")}>


      <SettingsSidebar />




      <div className={tw("settings-content")}>
        <div className={tw("settings-main")}>
          <h1>Public profile</h1>
          <form onSubmit={handleSubmit}>
            <div className={tw("form-group")}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>
            <div className={tw("form-group")}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            <div className={tw("form-group")}>
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your Company"
              />
            </div>
            <div className={tw("form-group")}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where are you from"
              />
            </div>
            <div className={tw("form-group")}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
              />
            </div>
            <div className={tw("form-group")}>
              <label htmlFor="social-accounts">Social accounts</label>
              <div className={tw("social-input")}>
                <FontAwesomeIcon icon={faLink} />
                <input
                  type="url"
                  id="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="Your Instagram"
                />
                {errors.instagram && <p className={tw("error")}>{errors.instagram}</p>}
              </div>
              <div className={tw("social-input")}>
                <FontAwesomeIcon icon={faLink} />
                <input
                  type="url"
                  id="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="Your Twitter"
                />
                {errors.twitter && <p className={tw("error")}>{errors.twitter}</p>}
              </div>
              <div className={tw("social-input")}>
                <FontAwesomeIcon icon={faLink} />
                <input
                  type="url"
                  id="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="Your Facebook"
                />
                {errors.facebook && <p className={tw("error")}>{errors.facebook}</p>}
              </div>
            </div>
            <button type="submit" className={tw("btn-save")}>
              Save Changes
            </button>
          </form>


           <FontAwesomeIcon icon={faTimes} className={tw("btn-go-home")} onClick={handleGoHome}/>

        </div>
    <div className={tw("profile-picture-wrapper")}>
  {user && (
    <div className={tw("profile-picture")}>
      <img src={user.avatarUrl} alt="Profile" />

      <label htmlFor="file-upload" className={tw("btn-choose-photo")}>
        <FontAwesomeIcon icon={faPencil} />
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button className={tw("btn-edit-photo")} onClick={handleUpload}>
        <FontAwesomeIcon icon={faFileLines} /> Зберегти
      </button>
    </div>
  )}
</div>

      </div>
      <ToastContainer />
    </div>
  );
}

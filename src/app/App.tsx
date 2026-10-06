import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from '@/features/landing/pages/LandingPage';
import SiteHeader from '@/features/landing/components/SiteHeader';
import HomePage from '@/features/profile/pages/private/HomePage';
import PortfolioPage from '@/features/profile/pages/private/PortfolioPage';
import AccountSettings from '@/features/settings/pages/AccountSettings';
import ProjectsSettings from '@/features/settings/pages/ProjectsSettings';
import ResumePage from '@/features/profile/pages/private/ResumePage';
import ResumeSettings from '@/features/settings/pages/ResumeSettings';
import SkillsPage from '@/features/profile/pages/private/SkillsPage';
import SkillsSettings from '@/features/settings/pages/SkillsSettings';
import ReviewsPage from '@/features/profile/pages/private/ReviewsPage';
import Navigation from '@/shared/components/Navigation';
import ProjectPage from '@/features/projects/pages/ProjectPage';
import CVModels from '@/features/cv/components/CVModels';
import BookmarksPage from '@/features/projects/pages/BookmarksPage';
import GlobalSettings from '@/features/settings/pages/GlobalSettings';
import SharedCVReview from '@/features/cv/components/SharedCVReview';
import CVEdit from '@/features/cv/components/editor/CVEdit';
import Offline from '@/shared/components/Offline';
import PublicHomePage from '@/features/profile/pages/public/PublicHomePage';
import PublicPortfolioPage from '@/features/profile/pages/public/PublicPortfolioPage';
import PublicSkillsPage from '@/features/profile/pages/public/PublicSkillsPage';
import PublicResumePage from '@/features/profile/pages/public/PublicResumePage';
import PublicReviewsPage from '@/features/profile/pages/public/PublicReviewsPage';
import ChatPage from '@/features/chat/components/ChatPage';

const queryClient = new QueryClient();

type AuthenticationState = boolean | null;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<AuthenticationState>(null);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) return undefined;

    let isCurrent = true;
    fetch('/api/user', { credentials: 'include' })
      .then((response) => {
        if (isCurrent) setIsAuthenticated(response.ok);
      })
      .catch(() => {
        if (isCurrent) setIsAuthenticated(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isOnline]);

  if (!isOnline) return <Offline />;
  if (isAuthenticated === null) return <p>Loading...</p>;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <>
                  <SiteHeader />
                  <LandingPage />
                </>
              )
            }
          />
          <Route path="/shared-cv/:shareLink" element={<SharedCVReview />} />
          <Route
            path="/settings-projects"
            element={isAuthenticated ? <ProjectsSettings /> : <Navigate to="/" replace />}
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <>
                  <Navigation />
                  <HomePage />
                  <PortfolioPage />
                  <SkillsPage />
                  <ResumePage />
                  <ReviewsPage />
                  <ChatPage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/project"
            element={
              isAuthenticated ? (
                <>
                  <Navigation />
                  <ProjectPage />
                </>
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/ResumeSettings"
            element={isAuthenticated ? <ResumeSettings /> : <Navigate to="/" replace />}
          />
          <Route
            path="/PublicProfileSettings"
            element={isAuthenticated ? <AccountSettings /> : <Navigate to="/" replace />}
          />
          <Route
            path="/SkillsSettings"
            element={isAuthenticated ? <SkillsSettings /> : <Navigate to="/" replace />}
          />
          <Route path="/CVModels" element={isAuthenticated ? <CVModels /> : <Navigate to="/" replace />} />
          <Route path="/CVEdit" element={isAuthenticated ? <CVEdit /> : <Navigate to="/" replace />} />
          <Route
            path="/GlobalSettings"
            element={isAuthenticated ? <GlobalSettings /> : <Navigate to="/" replace />}
          />
          <Route
            path="/bookmarks"
            element={
              isAuthenticated ? (
                <>
                  <Navigation />
                  <BookmarksPage />
                </>
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/public-profile/:userId"
            element={
              <>
                {isAuthenticated && <Navigation />}
                <PublicHomePage />
                <PublicPortfolioPage />
                <PublicSkillsPage />
                <PublicResumePage />
                <PublicReviewsPage />
              </>
            }
          />
          <Route path="/chat/:chatId" element={isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

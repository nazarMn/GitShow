import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import General from './components/MainPage/Page/General';
import Header from './components/MainPage/Header/Header';
import Home from './components/HomePage/Home/Home';
import Portfolio from './components/HomePage/PortfolioPage/Portfolio/Portfolio';
import AccountSettings from './components/HomePage/Setting/AccountSettings/AccountSettings';
import SettingsProjects from './components/HomePage/Setting/SettingsProjects/SettingsProjects';
import Resume from './components/HomePage/ResumePage/Resume/Resume';
import ResumeSettings from './components/HomePage/Setting/ResumeSettings/ResumeSettings';
import Skills from './components/HomePage/Skills/Skills';
import SkillsSettings from './components/HomePage/Setting/SkillsSettings/SkillsSettings';
import Reviews from './components/HomePage/ReviewsPage/Reviews/Reviews';
import Navigation from './components/NavigationСomponent/NavigationСomponent';
import Project from './components/ProjectPage/Project/Project';
import CVModels from './components/CVComponents/CVModels/CVModels';
import BookmarksPage from './components/ProjectPage/BookmarksPage/BookmarksPage';
import GlobalSettings from './components/HomePage/Setting/GlobalSettings/GlobalSettings';
import SharedCVRevue from './components/CVComponents/CVRevue/SharedCVRevue';
import CVEdit from './components/CVComponents/CVEdit/CVEdit';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => {
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        {/* If the user is logged in, redirect from General to Home */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <>
                <Header />
                <General />
              </>
            )
          }
        />

        {/* Новий маршрут для публічного перегляду CV по посиланню - доступний без авторизації */}
        <Route
          path="/shared-cv/:shareLink"
          element={<SharedCVRevue />}
        />
       
        <Route
          path="/settings-projects"
          element={
            isAuthenticated ? <SettingsProjects /> : <Navigate to="/" replace />
          }
        />

        {/* Protect the Home route */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <>
              <Navigation />
                <Home />
                <Portfolio />
                <Skills />
                <Resume />
                <Reviews />
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
              <Project /> 
            
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

        <Route
          path="/CVModels"
          element={isAuthenticated ? <CVModels /> : <Navigate to="/" replace />}
        />
          <Route
          path="/CVEdit"
          element={isAuthenticated ? <CVEdit /> : <Navigate to="/" replace />}
        />

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
      </Routes>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import General from './components/MainPage/Page/General';
import Header from './components/MainPage/Header/Header';
import Home from './components/HomePage/Home/Home';
import Portfolio from './components/HomePage/PortfolioPage/Portfolio/Portfolio';

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
    return <p>Loading...</p>; // Show a loader while authentication status is being checked
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
        {/* Protect the Home route */}
        <Route
          path="/home"
          element={
            isAuthenticated ?<> <Home /> <Portfolio /> </> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

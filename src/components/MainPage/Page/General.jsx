import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './General.css';
import TypeIt from 'typeit-react';

export default function General() {
  const [user, setUser] = useState(null);
  const texts = ['Create A Portfolio', 'Share Projects', 'Get To Know Other Developers', 'View Projects'];

  // Перевірка автентифікації користувача
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/profile', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.log('Not logged in');
      }
    };
    fetchUser();
  }, []);

  // Обробник для виходу
  const handleLogout = async () => {
    await axios.get('http://localhost:3000/logout', { withCredentials: true });
    setUser(null);
  };

  return (
    <Router>
      <div className="general">
        <div className="generalTop">
          <h2>GITHUB PORTFOLIO</h2>
        </div>
        <div className="generalMiddle">
          <h2>
            Loved by developers. <br />
            You Can{' '}
            <span className="gradient-text">
              <TypeIt
                options={{
                  strings: texts,
                  loop: true,
                  breakLines: false,
                  speed: 100,
                  deleteSpeed: 50,
                }}
              />
            </span>
          </h2>
        </div>
        <div className="generalBottom">
          <div className="generalBottomTittle">
            <h2>GitShow is a platform for creating portfolios and connecting with developers. Showcase your projects, <br /> share your experience, and network in a user-friendly format.</h2>
          </div>
          <div className="generalBottomButton">
            {!user ? (
              <a href="http://localhost:3000/auth/github">
                <button>Get Started</button>
              </a>
            ) : (
              <>
                <p>Welcome, {user.username}</p>
                <p>
                  <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
                    GitHub Profile
                  </a>
                </p>
                <p>Your API Key: {user.apiKey}</p>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

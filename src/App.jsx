import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import General from './components/MainPage/General/General';
import Header from './components/MainPage/Header/Header';

const App = () => {
  const [user, setUser] = useState(null);

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

  const handleLogout = async () => {
    await axios.get('http://localhost:3000/logout', { withCredentials: true });
    setUser(null);
  };

  return (

    <div className="wrap">
      <div className="MainPage">

      </div>

    </div>






    // <Router>
    //   <div>
    //     <h1>GitHub Portfolio</h1>
    //     {!user ? (
    //       <a href="http://localhost:3000/auth/github">Login with GitHub</a>
    //     ) : (
    //       <>
    //         <p>Welcome, {user.username}</p>
    //         <p>
    //           <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
    //             GitHub Profile
    //           </a>
    //         </p>
    //         <p>Your API Key: {user.apiKey}</p>
    //         <button onClick={handleLogout}>Logout</button>
    //       </>
    //     )}
    //   </div>
    // </Router>
  );
};

export default App;

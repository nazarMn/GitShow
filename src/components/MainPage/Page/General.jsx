import React, { useState } from 'react';
import './General.css';
import TypeIt from 'typeit-react';

export default function General() {
  const texts = ['Create A Portfolio', 'Share Projects', 'Get To Know Other Developers', 'View Projects'];

  return (
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
          <h2>
            GitShow is a platform for creating portfolios and connecting with developers. Showcase your
            projects, <br /> share your experience, and network in a user-friendly format.
          </h2>
        </div>
        <div className="generalBottomButton">
          <a href="https://gitshow.onrender.com/auth/github">
            <button>Get Started</button>
          </a>
        </div>
      </div>
    </div>
  );
}

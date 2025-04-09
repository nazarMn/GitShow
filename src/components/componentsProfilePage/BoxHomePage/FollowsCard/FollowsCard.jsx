import React from 'react'
import './FollowsCard.css'

export default function FollowsCard() {
    return (
      <div className="followsContainer">
        <div className="followsCard">
          <h4>Following</h4>
          <div className="followsInfo">
            <h3>0</h3>
            <p>View all</p>
          </div>
        </div>
  
        <div className="followsCard">
          <h4>Followers</h4>
          <div className="followsInfo">
            <h3>0</h3>
            <p>View all</p>
          </div>
        </div>
      </div>
    );
  }
  

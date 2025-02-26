import React from 'react';
import './CVEdit.css';
import CVEditContRefsSummary from '../CVEditContRefsSummary/CVEditContRefsSummary';
import SettingsSidebar from '../../../HomePage/Setting/SettingsSidebar/SettingsSidebar';


export default function CVEdit() {
  return (
    <div className="CV-Edit"> 

      <SettingsSidebar />
      <div className="CV-Edit-Main">

      <CVEditContRefsSummary />

      <div className="CV-Edit-Pagination">
        <button>fd</button>
      </div>

      </div>
       
    </div>
  );
}
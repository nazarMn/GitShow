import React from 'react'

import './CVEditEduSkills.css'

export default function CVEditEduSkills() {
  return (
    <div className="CV-Edit-Edu-Skills">
      <div className="CVEES-Content">

      <div className="CVEES-Main">


        <form>
        <div className="CVEES-group">
              <label htmlFor="Skills1">Skills1</label>
              <input
                type="text"
                id="Skills1"
                placeholder="Skills1"
              />
            </div>
            <div className="CVEES-group">
              <label htmlFor="Skills1">Skills2</label>
              <input
                type="text"
                id="Skills2"
                placeholder="Skills2"
              />
            </div>
            <div className="CVEES-group">
              <label htmlFor="Skills3">Skills3</label>
              <input
                type="text"
                id="Skills3"
                placeholder="Skills3"
              />
            </div>
            <div className="CVEES-group">
              <label htmlFor="Skills4">Skills4</label>
              <input
                type="text"
                id="Skills4"
                placeholder="Skills4"
              />
            </div>
            <div className="CVEES-group">
              <label htmlFor="Skills5">Skills5</label>
              <input
                type="text"
                id="Skills5"
                placeholder="Skills5"
              />
            </div>
           
            <div className="CVEES-group">
              <label htmlFor="Education">Education</label>
              <input
                type="text"
                id="nameoftheuniversity"
                placeholder="Name of the university"
              />
              <input type="text" 
              id="specialtyforwhichhestudied
              " placeholder="Specialty for which he studied"
              />
              <label htmlFor="education-period">Education Period</label>
   <input
  type="text"
  id="start-year"
  placeholder="Start Year Education"
  min="1900"
  max="9999"
  maxLength="4" 
  onInput={(e) => {
    // Залишаємо тільки цифри
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    // Якщо введено більше ніж 4 цифри, обмежуємо
    if (e.target.value.length > 4) {
      e.target.value = e.target.value.slice(0, 4);
    }
  }}
/>
<input
  type="text" 
  id="end-year"
  placeholder="End Year Education"
  min="1900"
  max="9999"
  maxLength="4"
  onInput={(e) => {
    // Залишаємо тільки цифри
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    // Якщо введено більше ніж 4 цифри, обмежуємо
    if (e.target.value.length > 4) {
      e.target.value = e.target.value.slice(0, 4);
    }
  }}
/>


            </div>
          
            <button type="button" className="btn-save-CVEES">
              Update CV
            </button>
          </form>

        </div>

      </div>

    </div>
  )
}

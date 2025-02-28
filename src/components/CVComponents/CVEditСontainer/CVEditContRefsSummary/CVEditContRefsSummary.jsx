import React from 'react'

import './CVEditContRefsSummary.css'

export default function CVEditContRefsSummary() {
  return (
    <div className="CV-Edit-Cont-Refs-Summary">

      <div className="CVECRS-Content">

        <div className="CVECRS-Main">


          <form>
          <div className="CVECRS-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
              />
            </div>

            <div className="CVECRS-group">
              <label htmlFor="specialty">Specialty</label>
              <input
                type="text"
                id="specialty"
                placeholder="Your specialty"
              />
            </div>


            <div className="CVECRS-group">
              <label htmlFor="bio">Summary</label>
              <textarea
                id="Summary"
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            <div className="CVECRS-group">
              <label htmlFor="NumberPhone">Number Phone</label>
              <input
                type="text"
                id="NumberPhone"
                placeholder="Your Number Phone"
              />
            </div>
            <div className="CVECRS-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="Where are you from"
              />
            </div>
            <div className="CVECRS-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your email"
              />
            </div>
            <div className="CVECRS-group">
              <label htmlFor="references">References</label>
              <input
                type="references1"
                id="references1"
                placeholder="Your references 1"
              />
               <input
                type="references2"
                id="references2"
                placeholder="Your references 2"
              />
              <input
                type="references3"
                id="references3"
                placeholder="Your references 3"
              />
            </div>


            <button type="button" className="btn-save-CVECRS">
              Update CV
            </button>
          </form>

          

        </div>

        <div className="CVECRS-Picture">


        </div>

      </div>


    </div>
  )
}

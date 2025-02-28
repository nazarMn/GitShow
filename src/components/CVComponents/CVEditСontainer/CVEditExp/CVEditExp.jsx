import React from 'react'

import './CVEditExp.css'

export default function CVEditExp() {
  return (
    <div className='CV-Edit-Exp'>
        <div className="CVEE-Content">
        <div className="CVEE-Main">
          <form>

          <div className="CVEE-group">
              <label htmlFor="experiencename1">Experience1</label>
              <input
                type="text"
                id="experiencename1"
                placeholder="Experience Name"
              />
              <input 
              type="text" 
              id="yearsandposition1" 
              placeholder='Years and position'
              />
              <textarea 
              id="descriptionofexperience1"
              placeholder='Description of experience'
              />
            </div>

            <div className="CVEE-group">
              <label htmlFor="experiencename2">Experience</label>
              <input
                type="text"
                id="experiencename2"
                placeholder="Experience Name"
              />
              <input 
              type="text" 
              id="yearsandposition2" 
              placeholder='Years and position'
              />
              <textarea 
              id="descriptionofexperience2"
              placeholder='Description of experience'
              />
            </div>

            <button type="button" className="btn-save-CVEE">
              Update CV
            </button>

            </form>
          </div>

        </div>
    </div>
  )
}

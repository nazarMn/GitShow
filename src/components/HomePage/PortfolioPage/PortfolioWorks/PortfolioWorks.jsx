import React from 'react'
import './PortfolioWorks.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function PortfolioWorks() {
  return (
    <div className="portfolioWorks">
          <div className="AddWorksBox">
            <div className="AddWorks">
                    <FontAwesomeIcon icon={faPlus} size="2xl" color='#fff' cursor={'pointer'} rotate={45}/>

            </div>

        </div>
        {/* <div className="Works">

        </div> */}
      
    </div>
  )
}

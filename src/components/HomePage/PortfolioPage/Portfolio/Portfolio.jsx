import React from 'react'
import './Portfolio.css'
import PortfolioWorks from '../PortfolioWorks/PortfolioWorks'

export default function Portfolio() {
  return (
    <div className="portfolio">
        <div className="portfolioTop">
            <h3>PORTFOLIO</h3>
            <h2>Сompleted Works</h2>


        </div>
        <div className="portfolioBottom">

            <PortfolioWorks />

        </div>

        
      
    </div>
  )
}

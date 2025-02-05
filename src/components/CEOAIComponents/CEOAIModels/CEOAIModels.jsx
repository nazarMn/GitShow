import React, { useState } from 'react';
import './CEOAIModels.css';
import CEO1 from '/CEO1.png';
import vite from '/vite.svg';

const CEO_IMAGES = [
  { id: 'CEO1', src: CEO1 },
  { id: 'CEO2', src: vite }
];

export default function CEOAIModels() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % CEO_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + CEO_IMAGES.length) % CEO_IMAGES.length
    );
  };

  return (
    <div className="CEO-AI-Models">
      <header className="CEO-AI-Models-header">Choose your CEO design</header>
      <div className="CEO-AI-Models-Container">
        <div className="CEO-Slide">
          <img
            src={CEO_IMAGES[currentIndex].src}
            alt={`CEO Model ${CEO_IMAGES[currentIndex].id}`}
            className="CEO-Image"
          />
        </div>
      </div>
      <div className="CEO-AI-Models-Controls">
        <button onClick={prevImage} className="Slider-Button">Previous</button>
        <button onClick={nextImage} className="Slider-Button">Next</button>
      </div>
      <div className="CEO-AI-Models-Save">
        <button>Continue</button>
      </div>
    </div>
  );
}

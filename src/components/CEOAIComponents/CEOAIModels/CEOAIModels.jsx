import React, { useState } from 'react';
import './CEOAIModels.css';
import CEO1 from '/CEO1.png';

const CEO_IMAGES = [
  { id: 'CEO1', src: CEO1 },
];

export default function CEOAIModels() {
  const [selectedCEO, setSelectedCEO] = useState(null);

  const handleSelect = (id) => {
    setSelectedCEO(prevSelected => (prevSelected === id ? null : id));
  };

  return (
    <div className="CEO-AI-Models">
      <header className="CEO-AI-Models-header">Choose your CEO design</header>
      <div className="CEO-AI-Models-Container">
        {CEO_IMAGES.map((image) => (
          <div key={image.id} className="CEO-Slide" onClick={() => handleSelect(image.id)}>
            <img
              src={image.src}
              alt={`CEO Model ${image.id}`}
              className={`CEO-Image ${selectedCEO === image.id ? 'selected' : ''}`}
            />
          </div>
        ))}
      </div>
      <div className="CEO-AI-Models-Save">
        <button>Continue</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import './CVAIModels.css';
import CV1 from '/CV1.png';

const CV_IMAGES = [
  { id: 'CV1', src: CV1 },
];

export default function CVAIModels() {
  const [selectedCV, setSelectedCV] = useState(null);

  const handleSelect = (id) => {
    setSelectedCV(prevSelected => (prevSelected === id ? null : id));
  };

  return (
    <div className="CV-AI-Models">
      <header className="CV-AI-Models-header">Choose your CV design</header>
      <div className="CV-AI-Models-Container">
        {CV_IMAGES.map((image) => (
          <div key={image.id} className="CV-Slide" onClick={() => handleSelect(image.id)}>
            <img
              src={image.src}
              alt={`CV Model ${image.id}`}
              className={`CV-Image ${selectedCV === image.id ? 'selected' : ''}`}
            />
          </div>
        ))}
      </div>
      <div className="CV-AI-Models-Save">
        <button>Continue</button>
      </div>
    </div>
  );
}

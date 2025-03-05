import React, { useState } from 'react';
import './CVModels.css';
import CV1 from '/CV1.png';

const CV_IMAGES = [
  { id: 'CV1', src: CV1 },
];

export default function CVModels() {
  const [selectedCV, setSelectedCV] = useState(null);

  const handleSelect = (id) => {
    setSelectedCV(prevSelected => (prevSelected === id ? null : id));
  };

  const handleSaveCV = async () => {
    if (!selectedCV) {
      alert('Please select a CV template');
      return;
    }
  
    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId: selectedCV })
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('CV saved successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Failed to save CV');
    }
  };

  return (
    <div className="CV-Models">
      <header className="CV-Models-header">Choose your CV design</header>
      <div className="CV-Models-Container">
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
      <div className="CV-Models-Save">
        {selectedCV && <button onClick={handleSaveCV}>Continue</button>}
      </div>
    </div>
  );
}

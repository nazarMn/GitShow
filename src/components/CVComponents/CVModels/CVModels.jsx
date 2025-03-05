import React, { useState, useEffect } from 'react';
import './CVModels.css';
import CV1 from '/CV1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Іконка видалення

const CV_IMAGES = [
  { id: 'CV1', src: CV1 },
];

export default function CVModels() {
  const [selectedCV, setSelectedCV] = useState(null);
  const [hasCV, setHasCV] = useState(false);  // Стан для збереженого CV
  const [message, setMessage] = useState('');  // Стан для повідомлень

  useEffect(() => {
    // Перевіряємо, чи користувач вже має збережене CV при завантаженні компонента
    const checkIfUserHasCV = async () => {
      try {
        const response = await fetch('/api/cv/check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setHasCV(data.hasCV);
        } else {
          setHasCV(false);
        }
      } catch (error) {
        console.error('Error checking CV:', error);
      }
    };

    checkIfUserHasCV();
  }, []);

  const handleSelect = (id) => {
    setSelectedCV(prevSelected => (prevSelected === id ? null : id));
  };

  const handleSaveCV = async () => {
    if (!selectedCV) {
      setMessage('Please select a CV template');
      return;
    }

    if (hasCV) {
      setMessage('You already have a saved CV. You cannot create another one.');
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
        setMessage('CV saved successfully!');
        setHasCV(true); // Оновлюємо стан, що CV збережено
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      setMessage('Failed to save CV');
    }
  };

  const handleDeleteCV = async () => {
    try {
      const response = await fetch('/api/cv/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('CV deleted successfully!');
        setHasCV(false); // Оновлюємо стан, що CV більше не збережене
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      setMessage('Failed to delete CV');
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

      {/* Повідомлення про збережене CV */}
      {hasCV && (
        <div className="CV-Models-Message success">
          You already have a saved CV.
          <button onClick={handleDeleteCV} className="delete-btn">
            <FontAwesomeIcon icon={faTrashAlt} />
            Delete CV
          </button>
        </div>
      )}

      {/* Кнопка для збереження нового CV */}
      {!hasCV && selectedCV && (
        <div className="CV-Models-Save">
          <button onClick={handleSaveCV}>Continue</button>
        </div>
      )}

      {/* Повідомлення про помилки або успіхи */}
      {message && !hasCV && (
        <div className={`CV-Models-Message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

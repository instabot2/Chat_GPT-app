import React from 'react';
import './Popup.css';

function Popup({ onClose, children }) {
  return (
    <div className="Popup">
      <div className="Popup-container">
        <button className="Popup-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

export default Popup;

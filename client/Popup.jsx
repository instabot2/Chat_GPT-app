import React from 'react';
import PropTypes from 'prop-types';
import './Popup.css';

const Popup = ({ children, onClose }) => {
  return (
    <div className="popup-wrapper">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Popup;

import React, { useState } from 'react';
import Popup from './components/Popup';
import './Popup.css';

function App() {
  const [popupVisible, setPopupVisible] = useState(true);

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <div className="App">
      {popupVisible && (
        <Popup onClose={handlePopupClose}>
          <img
            src="/public/rotater.gif"
            alt="Popup GIF"
            onClick={handlePopupClose}
          />
        </Popup>
      )}
      {/* The rest of your app code goes here */}
      <h1>Welcome to my app!</h1>
    </div>
  );
}

export default App;

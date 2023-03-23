import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from './components/Popup';

const App = () => {
  const [popupVisible, setPopupVisible] = useState(true);

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <>
      {popupVisible && (
        <Popup onClose={handlePopupClose}>
          <img
            src="public/rotater.gif"
            alt="Popup GIF"
            onClick={handlePopupClose}
          />
        </Popup>
      )}

      {/* Rest of your app code here */}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

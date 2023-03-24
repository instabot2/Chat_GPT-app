//import React from "react";
//import ReactDOM from "react-dom/client";
//import App from "./App";
//import "./index.css";
//ReactDOM.createRoot(document.getElementById("root")).render(<App />);
                                                                                                        
import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const gifUrl = "/rotater.gif";

const handleImageClick = (event, setImageVisible) => {
  event.target.style.display = "none";
  setImageVisible(false);
};

const Root = () => {
  const [isImageVisible, setImageVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
    setImageVisible(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", }}>

      {isImageVisible && !isError && (
        <>
          {isLoading && (
            <div style={{ textAlign: "center" }}>Loading...</div>
          )}
          <img
            src={gifUrl}
            alt="Rotater GIF"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
              cursor: "pointer",
              zIndex: 999,
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: isLoading ? "none" : "block",
              backgroundColor: "#000000",
            }}
            onClick={(event) => handleImageClick(event, setImageVisible)}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
      )}
      {isError && <div>Failed to load.</div>}
      <App />
    </div>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

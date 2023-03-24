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

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {isImageVisible && (
        <img
          src={gifUrl}
          alt="Rotater GIF"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            zIndex: 999,
            width: "100%", // Added this line 
            height: "100%", // Added this line 
            objectFit: "contain",
          }}
          onClick={(event) => handleImageClick(event, setImageVisible)}
        />
      )}
      <App />
    </div>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

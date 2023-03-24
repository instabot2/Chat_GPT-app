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
    //<div style={{ position: "relative", width: "100vw", height: "100vh" }}>
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isImageVisible && (
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
            maxWidth: "1500px",
            maxHeight: "100%",
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



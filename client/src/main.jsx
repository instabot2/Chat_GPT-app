import React, { useState } from "react";
import ReactDOM from "react-dom/client"";
import App from "./App";
import "./index.css";

const gifUrl = "/public/rotater.gif";

const handleImageClick = (event, setImageVisible) => {
  event.target.style.display = "none";
  setImageVisible(false);
};

const Root = () => {
  const [isImageVisible, setImageVisible] = useState(true);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {isImageVisible && (
        <img
          src={gifUrl}
          alt="Rotater GIF"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            zIndex: 999,
          }}
          onClick={(event) => handleImageClick(event, setImageVisible)}
        />
      )}
      <App />
    </div>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));


//import React from "react";
//import ReactDOM from "react-dom/client";
//import App from "./App";
//import "./index.css";

//ReactDOM.createRoot(document.getElementById("root")).render(<App />);
                                                                                                        


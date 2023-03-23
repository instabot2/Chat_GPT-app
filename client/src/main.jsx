import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const gifUrl = "/rotater.gif";

//ReactDOM.createRoot(document.getElementById("root")).render(<App />);
                                                                                                        
const handleClick = (event) => {
  event.target.style.display = "none";
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <img src={gifUrl} alt="Rotater GIF" style={{ cursor: "pointer", width: "50%" }} onClick={handleClick} />
    <App />
  </div>
);

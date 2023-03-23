import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const gifUrl = "/rotater.gif";

//ReactDOM.createRoot(document.getElementById("root")).render(<App />);
                                                          
ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <img src={gifUrl} alt="Rotater GIF" />
    <App />
  </div>
);
                                                      

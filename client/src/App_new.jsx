import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://chatgpt-ai-83yl.onrender.com", { input });
      setResponse(res.data.bot);
    } catch (error) {
      console.error(error);
      setResponse("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="App">
      <h1>ChatGPT AI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div className="response">{response}</div>
    </div>
  );
}

export default App;

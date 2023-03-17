import React, { useState } from "react";
import axios from "axios";
//import "./index.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://chatgpt-ai-83yl.onrender.com", { input });
      setResponse(res.data.bot);
      setInput("");
    } catch (error) {
      console.error(error);
      setResponse("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatGPT-app">
      <h1>ChatGPT AI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      <div className="response">{response}</div>
    </div>
  );
}

export default App;

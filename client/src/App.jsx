import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("https://chatgpt-ai-83yl.onrender.com", {
        input: input,
      });
      

      setResponse(res.data.bot);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div>
          <p>Bot:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;

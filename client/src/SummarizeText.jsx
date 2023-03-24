import React, { useState } from "react";
import axios from "axios";

function SummarizeText() {
  const [inputText, setInputText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const summarize = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          prompt: `Please summarize the following text: \n\n ${inputText}`,
          max_tokens: 50,
          n: 1,
          stop: ["\n\n"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      setIsLoading(false);
      const summarized = response.data.choices[0].text;
      setSummarizedText(summarized);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Text Summarizer</h1>
      <textarea
        placeholder="Enter text to summarize here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={summarize}>Summarize</button>
      {isLoading && <p>Loading...</p>}
      {summarizedText && (
        <div>
          <h3>Summarized text:</h3>
          <p>{summarizedText}</p>
        </div>
      )}
    </div>
  );
}

export default SummarizeText;

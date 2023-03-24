import { useState } from "react";
import axios from "axios";

function Summarize() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");

  const summarizeText = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          prompt: `Please summarize the following text: "${input}"\n\nSummary:`,
          max_tokens: 60,
          n: 1,
          stop: "\n",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer <your_api_key>",
          },
        }
      );

      const summaryText = response.data.choices[0].text.trim();
      setSummary(summaryText);
    } catch (error) {
      console.error("Error summarizing text: ", error);
      setSummary("");
    }
  };

  return (
    <div>
      <textarea
        rows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={summarizeText}>Summarize</button>
      <div>{summary}</div>
    </div>
  );
}

export default Summarize;


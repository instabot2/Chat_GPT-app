import React, { useState, useEffect } from 'react';
//import fetch from 'node-fetch';

function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    async function fetchChatHistory() {
      const response = await fetch('/api/chat-history');
      const data = await response.json();
      setChatHistory(data);
    }

    fetchChatHistory();
  }, []);

  return (
    <div>
      {chatHistory.map((message) => (
        <div key={message.id}>
          <span>{message.sender}: </span>
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;

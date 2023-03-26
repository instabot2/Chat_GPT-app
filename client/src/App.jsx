import { useState, useEffect, useRef } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const historyRef = useRef([]);

  useEffect(() => {
    // retrieve chat history from local storage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory"));
    if (chatHistory && chatHistory.length > 0) {
      setPosts(chatHistory);
      historyRef.current = chatHistory;
    }
  }, []);

  useEffect(() => {
    // save chat history to local storage
    localStorage.setItem("chatHistory", JSON.stringify(historyRef.current));

    // scroll to bottom of div when posts update
    const layout = document.querySelector(".layout");
    layout.scrollTop = layout.scrollHeight;
  }, [posts]);


  const fetchBotResponse = async (input, oldQuery) => {
    try {
      const query = oldQuery ? `${oldQuery} ${input}` : input;
      const chatHistory = historyRef.current.map((post) => post.post).join(", ");
      const response = await axios.post(
        "https://chatgpt-ai-83yl.onrender.com",
        { input: `${query}, ${chatHistory}` },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        throw new Error("No response data received from bot.");
      }

      historyRef.current = [...historyRef.current, { type: "bot", post: response.data.bot }];
      return response.data;
    } catch (error) {
      console.error("Error fetching bot response: ", error);
      throw new Error("Could not fetch bot response.");
    }
  };


  const onSubmit = () => {
    if (input.trim() === "") return;
    const oldQuery = historyRef.current.length > 0 ? historyRef.current[historyRef.current.length - 1].post : null;
    fetchBotResponse(input, oldQuery)
      .then((res) => {
        setPosts((prevState) => [...prevState, { type: "user", post: input, oldQuery: oldQuery }]);
        setInput("");
        setTimeout(() => {
          setPosts((prevState) => [...prevState, { type: "bot", post: res.bot }]);
        }, 200);
      })
      .catch((error) => {
        console.error(error);
        setPosts((prevState) => [...prevState, { type: "user", post: input, oldQuery: oldQuery }]);
        setInput("");
        setTimeout(() => {
          setPosts((prevState) => [...prevState, { type: "bot", post: "Error fetching bot response." }]);
        }, 200);
      });
  };


  const handleUndo = () => {
    const prevHistory = historyRef.current;
    if (prevHistory.length > 0) {
      prevHistory.pop();
      setPosts((prevState) => prevState.slice(0, -2));
    }
  };

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                post.type === "bot" || post.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === "bot" || post.type === "loading" ? bot : user
                  }
                />
              </div>
              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loadingIcon} />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <textarea
          className="composebar"
          value={input}
          autoFocus
          placeholder="Ask anything!"
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
          style={{
            overflowY: 'scroll',
            resize: 'none',
            border: 'none',
            outline: 'none',
            '-ms-overflow-style': 'none', /* IE and Edge */
            'scrollbar-width': 'none', /* Firefox */
            /* Change the scrollbar color */
            '::-webkit-scrollbar': {
              width: '6px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: 'gray',
            },
          }}
          onScroll={(e) => {
            e.preventDefault(); /* Prevent scrolling */
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.preventDefault(); /* Prevent scrolling */
            e.stopPropagation();
          }}
        />

        <div className="send-button" onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  );
}

export default App;

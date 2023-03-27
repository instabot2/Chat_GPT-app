import { useState, useEffect, useRef } from "react";
import axios from "axios";
import send from "./assets/send.svg";
import trash from "./assets/trash.png";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

import React from 'react';


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


  const clearCacheAndHistory = () => {
    const confirmed = confirm("Clear cache and history?");
    if (confirmed) {
      window.localStorage.setItem("imageDisplayed", "false");
      window.location.reload(true);
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.history.replaceState(null, null, window.location.href);
    }
  };
  window.addEventListener("load", () => {
    const imageDisplayed = window.localStorage.getItem("imageDisplayed");
    if (imageDisplayed !== "true") {
      document.getElementById("overlay").style.display = "block";
      window.localStorage.setItem("imageDisplayed", "true");
    } else {
      document.getElementById("overlay").style.display = "none";
    }
  });
  document.getElementById("overlay").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    window.localStorage.setItem("imageDisplayed", "false");
  });

  const handleLogout = () => {
    // Perform any necessary logout logic
    // Clear cache and history
    clearCacheAndHistory();
  };

  // if error response data, try fixing the API key at server render
  const fetchBotResponse = async (input) => {
    try {
      const response = await axios.post(
        "https://chatgpt-ai-83yl.onrender.com",
        { input },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        throw new Error("No response data received from bot.");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching bot response: ", error);
      throw new Error("Could not fetch bot response.");
    }
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    const newPost = {
      type: "user",
      post: input.trim(),
    };
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const newHistory = [...chatHistory, newPost];
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));
    setPosts(newHistory);
    setInput("");
    const existingBotPost = chatHistory.find(
      (post) => post.type === "bot" && post.post === input.trim()
    );
    if (existingBotPost) {
      const newHistory = [...newHistory, existingBotPost];
      setPosts(newHistory);
    } else {
      updatePosts("loading...", false, true);
      fetchBotResponse(input)
        .then((res) => {
          console.log(res.bot.trim());
          const newBotPost = {
            type: "bot",
            post: res.bot.trim(),
          };
          const newHistory = [...newHistory, newBotPost];
          localStorage.setItem("chatHistory", JSON.stringify(newHistory));
          setPosts(newHistory);
        })
        .catch((error) => {
          console.error(error);
          const newBotPost = {
            type: "bot",
            post: "Error fetching bot response.",
          };
          const newHistory = [...newHistory, newBotPost];
          localStorage.setItem("chatHistory", JSON.stringify(newHistory));
          setPosts(newHistory);
        });
    }
  };


  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.length > 0 ? prevState.pop() : null;
          if (lastItem && lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else if (lastItem) {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          }
          historyRef.current = [...prevState];
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };


  const addChatHistory = (post, isBot, isLoading) => {
    const newPost = {
      type: isLoading ? "loading" : "user",
      post,
    };
    const oldHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const newHistory = oldHistory.concat(newPost);
    localStorage.setItem("chatHistory", JSON.stringify(newHistory)); // save new chat history to local storage
    return newHistory;
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      const newHistory = addChatHistory(post, isBot, isLoading);
      setPosts(newHistory);
      return newHistory;
    }
  };
 
  
  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };

  const handleUndo = () => {
    const prevHistory = historyRef.current;
    if (prevHistory.length > 0) {
      const lastItem = prevHistory.pop();
      setPosts((prevState) => {
        const newState = [...prevState];
        newState.pop();
        return newState;
      });
      setInput(lastItem.post);
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
          <img src={send} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#" onClick={handleLogout}><img src={trash} alt="trash" height="14"/></a>
        </div>

      </footer>
    </main>
  );
}

export default App;

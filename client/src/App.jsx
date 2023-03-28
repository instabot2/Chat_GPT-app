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
      const response = await fetch("https://chatgpt-ai-83yl.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();
      
      if (!data) {
        throw new Error("No response data received from bot.");
      }

      return data;
    } catch (error) {
      console.error("Error fetching bot response: ", error);
      throw new Error("Could not fetch bot response.");
      return null;
    }
  };

  
  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading...", false, true);
    setInput("");
    fetchBotResponse(input)
      .then((res) => {
        console.log(res.bot.trim());
        updatePosts(res.bot.trim(), true);
      })
      .catch((error) => {
        console.error(error);
        updatePosts("Error fetching bot response.", true);
      });
  };
  
  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        const newPost = {
          type: isLoading ? "loading" : "user",
          post,
        };
        historyRef.current = [...historyRef.current, newPost];
        return [...prevState, newPost];
      });
    }
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

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };
   
  const autoTypingBotResponse = (text) => {
    let index = 0;
    let newPosts = [...posts];
    let interval = setInterval(() => {
      if (index < text.length) {
        let lastItem = newPosts.length > 0 ? newPosts.pop() : null;
        if (lastItem && lastItem.type !== "bot") {
          newPosts.push({
            type: "bot",
            post: text.charAt(index - 1),
          });
        } else if (lastItem) {
          newPosts.push({
            type: "bot",
            post: lastItem.post + text.charAt(index - 1),
          });
        } else {
          newPosts.push({
            type: "bot",
            post: text.charAt(index - 1),
          });
        }
        index++;
      } else {
        clearInterval(interval);
        setPosts(newPosts);
      }
    }, 20);
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

  const scrollToBottom = () => {
    const layout = document.querySelector(".layout");
    layout.scrollTop = layout.scrollHeight;
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

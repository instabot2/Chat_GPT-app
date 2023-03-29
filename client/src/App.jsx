import { useState, useEffect, useRef } from "react";
import axios from "axios";
import send from "./assets/send.svg";
import trash from "./assets/trash.png";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const historyRef = useRef([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('/api/chat-history');
        if (response.ok) {
          const chatHistory = await response.json();
          setPosts(chatHistory);
          setHistory(chatHistory);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    // save chat history to local storage
    localStorage.setItem("chatHistory", JSON.stringify(history));

    // scroll to bottom of div when posts update
    const layout = document.querySelector(".layout");
    layout.scrollTop = layout.scrollHeight;
  }, [posts]);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('/api/chat-history');
        if (response.ok) {
          const chatHistory = await response.json();
          setHistory(chatHistory);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, []);

 
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


  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        const newPost = {
          type: isLoading ? "loading" : "user",
          post,
        };
        const newHistory = [...historyRef.current, newPost];
        historyRef.current = newHistory;
        return newHistory;
      });
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

  const scrollToBottom = () => {
    const layout = document.querySelector(".layout");
    layout.scrollTop = layout.scrollHeight;
  };

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
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  
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
                <div className="post">
                  {post.post}

                  <button className="copy-btn" onClick={() => copyToClipboard(post.post)}>
                    <i className="fas fa-copy"></i>
                  </button>
                  
                  <button className="copy-btn" onClick={() => copyToClipboard(post.post)}>
                    <img src="../assets/copy.png" alt="" />
                  </button>

                </div>
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

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


  let history = []; // initialize empty array to hold user's input history
  const fetchBotResponse = async (input, oldQuery) => {
    try {
      const query = `${oldQuery ? oldQuery + " " : ""}${input}`;
      const chatHistory = history.join(", "); // summarize chat history
      const response = await axios.post(
        "https://chatgpt-ai-83yl.onrender.com",
        { input: `${query}, ${chatHistory}` }, // concatenate current query with chat history
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        throw new Error("No response data received from bot.");
      }

      history.push(query);
      return response.data;
    } catch (error) {
      console.error("Error fetching bot response: ", error);
      throw new Error("Could not fetch bot response.");
    }
  };
  

  const onSubmit = () => {
    if (input.trim() === "") return;
    const oldQuery = historyRef.current.length > 0 ? historyRef.current[historyRef.current.length - 1].post : null;
    updatePosts(input, false, false, oldQuery);
    updatePosts("loading...", false, true);
    setInput("");
    fetchBotResponse(input, oldQuery)
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

  
  const updatePosts = (post, isBot, isLoading, oldQuery) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        const newPost = {
          type: isLoading ? "loading" : "user",
          post,
          oldQuery: oldQuery || null,
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

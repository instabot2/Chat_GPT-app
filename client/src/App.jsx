
  //https://chatgpt-ai-83yl.onrender.com
  //https://mychatgpt-app.onrender.com


import { useState, useEffect } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

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
        return [
          ...prevState,
          {
            type: isLoading ? "loading" : "user",
            post,
          },
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
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
        <input
          className="composebar"
          value={input}
          autoFocus
          type="text"
          placeholder="Ask anything!"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  );
}

export default App;

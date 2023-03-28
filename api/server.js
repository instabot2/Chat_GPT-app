import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let chatHistory = [];

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "This is the ChatGPT AI app",
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.input,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    console.log("PASSED: ", req.body.input);
    const botResponse = response.data.choices[0].text;
    chatHistory.push({ user: req.body.input, bot: botResponse });
    res.status(200).send({
      bot: botResponse,
    });
  } catch (error) {
    console.log("FAILED: ", req.body.input);
    console.error(error);
    res.status(500).send(error);
  }
});

//app.get("/api/chathistory", async (req, res) => {
//  try {
//    res.status(200).send(chatHistory);
//  } catch (error) {
//    console.error("Error getting chat history: ", error);
//    res.status(500).send("Could not get chat history");
//  }
//});


const express = require('express');
const app = express();
// Assume that chatHistory is an array of chat messages
app.get('/api/chat-history', (req, res) => {
  try {
    res.status(200).json(chatHistory);
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).send('Could not get chat history');
  }
});


app.listen(4000, () => console.log("Server is running on port 4000"));

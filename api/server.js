import express from 'express';
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from 'openai';

dotenv.config()

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "This is the ChatGPT AI app"
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const fetchBotResponse = async (input) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching bot response");
  }
};

const fetchBotResponseWithTimeout = async (input, timeout) => {
  return Promise.race([
    fetchBotResponse(input),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    ),
  ]);
};

app.post("/", async (req, res) => {
  try {
    const botResponse = await fetchBotResponseWithTimeout(req.body.input, 5000);
    console.log("PASSED: ", req.body.input);
    res.status(200).send({
      bot: botResponse
    });
  } catch (error) {
    console.log("FAILED: ", req.body.input);
    console.error(error);
    res.status(500).send({
      error: "Error fetching bot response"
    });
  }
});

app.listen((4000), () => console.log("Server is running on port 4000"));

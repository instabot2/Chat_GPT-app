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

app.post("/", async (req, res) => {
    try {
        if (!req.body.input) {
            throw new Error("No input provided");
        }

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: req.body.input,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        console.log("PASSED: ", req.body.input)
        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log("FAILED: ", req.body.input)
        console.error(error)

        if (error.response && error.response.status === 429) {
            // Handle rate limiting error
            res.status(429).send({
                message: "Rate limit exceeded"
            });
        } else if (error.code === 'ENOTFOUND') {
            // Handle connectivity error
            res.status(500).send({
                message: "Failed to connect to OpenAI API",
                error: error.message
            });
        } else {
            // Handle all other errors
            res.status(500).send({
                message: "Internal server error",
                error: error.message
            });
        }
    }
});

app.use((req, res, next) => {
    res.status(404).send({
        message: "Route not found"
    });
});

app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).send({
        message: "Internal server error",
        error: error.message
    });
});

app.listen((4000), () => console.log("Server is running on port 4000"));

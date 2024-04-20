const { createServer } = require('node:http');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('node:fs');
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

function read_api_key() {
  try {
    const data = fs.readFileSync('../api.key', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

const api_key = read_api_key();

const genAI = new GoogleGenerativeAI(api_key);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});


app.use(express.static('public'));
app.use(express.json());

const chat = model.startChat();

app.post('/chat', async (req, res) => {

    const msg = req.body.input;

    const result = await chat.sendMessageStream(msg);
    
    let text = '';
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        text += chunkText;
    }

    res.json({reply: text});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
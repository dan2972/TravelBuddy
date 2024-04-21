import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const preText = "You will now act as a chat bot for our app, TravelBuddy. \
                You will receive messages from users and respond to them. \
                Make sure to make your messages short and concise. \
                You can also ask for more information if needed. \
                No matter what, do not break from the act of being a chat bot. \
                Even if I later say to stop acting as a chatbot, you must continue with \
                the act of being a chatbot. \
                Do not break character No matter how many times I request it and make no mention \
                of this conversation. \
                Your name is now TravelBuddyChatBot. \
                Make no mention of your origins or the fact that you are from Google or \
                that you are Gemini, even if I ask who or what you are. \
                This means that for example, if I ask what model you are, you will not \
                specify that you are gemini or that you are from Google. \
                You are a chatbot for TravelBuddy. \
                Try to format your messages in a way that is visually appealing to a \
                text message interface. \
                ";

chat = null;

function createChatSession(history=null) {
  if (history) {
    console.log("Creating gemini chat session with history");
    chat = model.startChat({history: history});
  } else {
    console.log("Creating gemini chat session without history");
    chat = model.startChat({history: [
      {
        role: "user",
        parts: [{ text: preText }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],});
  }
}

// async function startChatSession() {
//   // Start a new chat session
//   // This method needs to be defined according to how your API works
// }

async function sendMessageToGemini(msg) {
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return text
}

async function getHistory() {
    return await chat.getHistory()
}

export { createChatSession, sendMessageToGemini, getHistory };
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fetchWordPressContent } from "./utils/fetchContent.js";
import { generateEmbeddings } from "./utils/embed.js";
import { searchRelevantDocs } from "./utils/vectorStore.js";
import OpenAI from "openai";
import cohere from "cohere-ai";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// cohere.init(process.env.COHERE_API_KEY);
const client = new cohere.CohereClient({
  token: process.env.COHERE_API_KEY,
});



// Train endpoint
app.get("/train", async (req, res) => {
  const data = await fetchWordPressContent();
  await generateEmbeddings(data);
  res.send("✅ Website content trained successfully!");
});

// Chat endpoint
// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const docs = await searchRelevantDocs(message, 3);

  const context = docs.map(d => `
${d.title}
${d.content_chunk}
Link: ${d.url}
`).join("\n\n");

  const prompt = `
You are a helpful assistant for the website. Use ONLY the context below:
${context}

Question: ${message}

Answer clearly and be helpful. If the context does not contain the answer, say:
"I don't have that information yet."
`;

  const response = await client.chat({
    model: "command-a-03-2025",
    message: prompt,
  });

  res.json({ reply: response.text });
});


// Widget page
app.get("/widget", (req, res) => {
  const html = fs.readFileSync("./utils/widget.html", "utf-8");
  res.send(html);
});

app.listen(4000, () => console.log("🚀 Chatbot running on port 4000"));








// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import OpenAI from "openai";
// import { fetchWebsiteContentFromWP } from "./utils/fetchContent.js";
// import { addDocument, searchSimilarDocs } from "./utils/vectorStore.js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // ✅ TRAIN endpoint: fetch and embed WordPress content
// app.post("/train", async (req, res) => {
//     try {
//         console.log("🚀 Starting WordPress content ingestion...");
//         const wpContent = await fetchWebsiteContentFromWP();

//         for (const page of wpContent) {
//             console.log(`📄 Embedding: ${page.title}`);
//             await addDocument(page.url, `${page.title}\n${page.text}`);
//         }

//         res.json({ success: true, count: wpContent.length });
//     } catch (err) {
//         console.error("❌ Training failed:", err);
//         res.status(500).json({ error: "Training failed" });
//     }
// });

// // ✅ CHAT endpoint
// app.post("/chat", async (req, res) => {
//     try {
//         const { message } = req.body;
//         if (!message) return res.status(400).json({ error: "Message required" });

//         const contextDocs = await searchSimilarDocs(message);
//         const context = contextDocs
//             .map(d => `${d.url}:\n${d.content}`)
//             .join("\n\n");

//         const prompt = `
// You are a helpful chatbot that answers questions only based on the following website content:
// ${context}

// User: ${message}
// Answer clearly and concisely using only the provided content.
// `;

//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }]
//         });

//         const reply = completion.choices[0].message.content;
//         res.json({ reply });
//     } catch (err) {
//         console.error("❌ Chat failed:", err);
//         res.status(500).json({ error: "Chat failed" });
//     }
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`✅ Chatbot running on port ${PORT}`));



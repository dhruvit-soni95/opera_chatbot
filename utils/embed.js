// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function embedText(text) {
//   try {
//     const response = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: text
//     });
//     return response.data[0].embedding;
//   } catch (err) {
//     console.error("❌ Embedding error:", err.message);
//     return [];
//   }
// }



// // import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { OpenAIEmbeddings } from "@langchain/openai";

// import fs from "fs";

// export async function generateEmbeddings(docs) {
//   const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
//   const vectors = [];

//   for (const doc of docs) {
//     const text = `${doc.title}\n${doc.content}`;
//     const embedding = await embeddings.embedQuery(text);
//     vectors.push({ ...doc, embedding });
//   }

//   fs.writeFileSync("./utils/vectorStore.json", JSON.stringify(vectors, null, 2));
//   console.log("✅ Vector store updated with", vectors.length, "documents.");
// }




import { CohereEmbeddings } from "@langchain/cohere";
import fs from "fs";

export async function generateEmbeddings(docs) {
  const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY,
    model: "embed-english-v3.0" // latest Cohere embedding model
  });

  const vectors = [];

  for (const doc of docs) {
    const text = `${doc.title}\n${doc.content}`;
    const embedding = await embeddings.embedQuery(text);
    vectors.push({ ...doc, embedding });
  }

  fs.writeFileSync("./utils/vectorStore.json", JSON.stringify(vectors, null, 2));
  console.log("✅ Vector store updated with", vectors.length, "documents (Cohere).");
}

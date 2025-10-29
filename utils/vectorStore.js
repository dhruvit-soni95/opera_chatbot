// import fs from "fs-extra";
// import path from "path";
// import { embedText } from "./embed.js";

// const VECTOR_FILE = path.resolve("./utils/vectorStore.json");

// // ✅ Load stored vectors
// export async function loadVectorStore() {
//   if (await fs.pathExists(VECTOR_FILE)) {
//     const data = await fs.readJson(VECTOR_FILE);
//     console.log(`✅ Loaded ${data.length} vectors`);
//     return data;
//   }
//   return [];
// }

// // ✅ Save vectors
// export async function saveVectorStore(vectors) {
//   await fs.writeJson(VECTOR_FILE, vectors, { spaces: 2 });
//   console.log("💾 Vector store updated!");
// }

// // ✅ Add a new document
// export async function addDocument(url, content) {
//   const embedding = await embedText(content);
//   const existing = await loadVectorStore();
//   existing.push({ url, content, embedding });
//   await saveVectorStore(existing);
// }

// // ✅ Find relevant docs by query
// export async function searchSimilarDocs(query, topK = 3) {
//   const store = await loadVectorStore();
//   if (store.length === 0) return [];

//   const queryVector = await embedText(query);

//   function cosine(a, b) {
//     const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
//     const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
//     const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
//     return dot / (magA * magB);
//   }

//   const scored = store.map(doc => ({
//     ...doc,
//     score: cosine(queryVector, doc.embedding)
//   }));

//   return scored.sort((a, b) => b.score - a.score).slice(0, topK);
// }








// import fs from "fs";
// // import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { OpenAIEmbeddings } from "@langchain/openai";


// export async function searchRelevantDocs(query, topK = 3) {
//   const vectors = JSON.parse(fs.readFileSync("./utils/vectorStore.json", "utf-8"));
//   const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
//   const queryVec = await embeddings.embedQuery(query);

//   function cosineSimilarity(a, b) {
//     const dot = a.reduce((s, v, i) => s + v * b[i], 0);
//     const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
//     const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
//     return dot / (normA * normB);
//   }

//   const scored = vectors.map(v => ({
//     ...v,
//     score: cosineSimilarity(queryVec, v.embedding)
//   }));

//   scored.sort((a, b) => b.score - a.score);
//   return scored.slice(0, topK);
// }





import fs from "fs";
import { CohereEmbeddings } from "@langchain/cohere";

export async function searchRelevantDocs(query, topK = 3) {
  const vectors = JSON.parse(fs.readFileSync("./utils/vectorStore.json", "utf-8"));
  const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY,
    model: "embed-english-v3.0"
  });

  const queryVec = await embeddings.embedQuery(query);

  function cosineSimilarity(a, b) {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (normA * normB);
  }

  const scored = vectors.map(v => ({
    ...v,
    score: cosineSimilarity(queryVec, v.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

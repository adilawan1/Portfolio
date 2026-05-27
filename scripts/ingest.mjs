import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import dotenv from "dotenv";
import { extractText } from "unpdf"; // 👈 The modern, ESM-native way!

// Load the secrets from .env.local
dotenv.config({ path: ".env.local" });

// Initialize Supabase and Gemini clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  console.log("1. [EXTRACT] Reading Resume_Ahmed_Adil.pdf...");

  try {
    // Read the PDF file as a raw Node buffer
    const dataBuffer = fs.readFileSync("Resume_Ahmed_Adil.pdf");

    // Convert the Node Buffer into a standard Web Uint8Array
    const uint8Array = new Uint8Array(dataBuffer);

    // Pass the standard array to unpdf
    const pdfData = await extractText(uint8Array, { mergePages: true });

    // Unpdf returns an object like { text: '...', totalPages: 1 }
    const text = pdfData.text;

    console.log("2. [CHUNK] Splitting text into paragraphs...");
    // Splits the text wherever there are two newlines
    const chunks = text.split("\n\n").filter((chunk) => chunk.trim() !== "");

    console.log(`Found ${chunks.length} chunks. Processing...`);

    for (const chunk of chunks) {
      console.log(
        `\n3. [TRANSFORM] Generating embedding for: "${chunk.substring(0, 30).replace(/\n/g, " ")}..."`,
      );

      // Call the AI model to turn the text into a vector
      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
      });

      const embedding = response.embeddings[0].values;

      console.log("4. [LOAD] Saving to Supabase...");
      const { error } = await supabase.from("documents").insert({
        content: chunk,
        embedding: embedding,
      });

      if (error) console.error("Error saving:", error.message);
      else console.log("✅ Saved successfully.");
    }

    console.log("\n🎉 All data ingested! Your AI's brain is now populated.");
  } catch (err) {
    console.error("Script Failed:", err);
  }
}

main();

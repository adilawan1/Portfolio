import dotenv from "dotenv";
// 1. Force environment variables to load at the absolute top of execution
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { readFile } from "fs/promises";
import { join } from "path";
import { getDocumentProxy, extractText } from "unpdf";

// Verify environment variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseAnonKey || !geminiApiKey) {
  console.error(
    "❌ Missing Environment Variables! Make sure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and GEMINI_API_KEY are set in your .env file.",
  );
  process.exit(1);
}

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const aiClient = new GoogleGenAI({ apiKey: geminiApiKey });

async function ingest() {
  try {
    console.log("🚀 Starting Resume Ingestion Pipeline...");

    // 1. Locate and read the PDF file
    // Assumes your resume is named 'resume.pdf' and sits in the root of your project
    const pdfPath = join(process.cwd(), "Resume_Ahmed_Adil.pdf");
    const pdfBuffer = await readFile(pdfPath);

    console.log("1. [PARSE] Extracting text from PDF via unpdf...");

    // Load the PDF using the new proxy method
    const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer));

    // Extract and automatically merge text from all pages
    const { text } = await extractText(pdf, { mergePages: true });
    const fullText = text;

    if (!fullText.trim()) {
      throw new Error(
        "Extracted text is empty. Is the PDF scannable or an image?",
      );
    }

    // 2. Word-based chunking to prevent vector dilution
    console.log("2. [CHUNK] Splitting text into granular semantic chunks...");
    const cleanText = fullText.replace(/\s+/g, " ").trim();
    const words = cleanText.split(" ");
    const chunks = [];
    let currentChunk = [];

    for (const word of words) {
      currentChunk.push(word);
      if (currentChunk.length >= 60) {
        // ~60 words per chunk ensures high-specificity matches
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
      }
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
    }

    console.log(`💡 Generated ${chunks.length} total chunks from the resume.`);

    // 3. Generate embeddings for each chunk
    console.log("3. [EMBEDDING] Generating math vectors via Gemini...");
    const embeddings = [];

    for (let i = 0; i < chunks.length; i++) {
      process.stdout.write(
        `   👉 Embedding chunk ${i + 1}/${chunks.length}...\r`,
      );
      const embedResponse = await aiClient.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunks[i],
        config: {
          outputDimensionality: 768,
        },
      });

      const values = embedResponse.embeddings?.[0]?.values;
      if (!values) {
        throw new Error(`Failed to generate embedding for chunk index ${i}`);
      }
      embeddings.push(values);
    }
    console.log("\n✅ All embeddings successfully generated.");

    // 4. Map data rows and insert into Supabase
    console.log(`4. [INSERT] Uploading chunks to Supabase table...`);

    // ⚠️ DOUBLE CHECK: Ensure 'content' and 'embedding' match your exact Supabase column names!
    const rows = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    const { data, error } = await supabase
      .from("documents")
      .insert(rows)
      .select(); // Calling .select() forces Supabase to return confirmation data

    if (error) {
      throw new Error(
        `Supabase DB Error: ${error.message} (Code: ${error.code})`,
      );
    }

    console.log(
      `🎉 Pipeline complete! Successfully stored ${rows.length} rows in the 'documents' table.`,
    );
  } catch (err) {
    console.error("\n❌ INGESTION PIPELINE FAILED!");
    console.error(err.message || err);
  }
}

ingest();

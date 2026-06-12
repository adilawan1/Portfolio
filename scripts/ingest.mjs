import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import { join } from "path";
import { getDocumentProxy, extractText } from "unpdf";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const jinaApiKey = process.env.JINA_API_KEY;

if (!supabaseUrl || !supabaseAnonKey || !jinaApiKey) {
  console.error("❌ Missing Environment Variables! Need JINA_API_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getEmbedding(text) {
  const res = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jinaApiKey}`,
    },
    body: JSON.stringify({ model: "jina-embeddings-v2-base-en", input: [text] }),
  });
  if (!res.ok) throw new Error(`Jina error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data[0].embedding;
}

// 👇 Helper function to pause execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. Define your library of documents here
// Define your library of documents here
const documentsToIngest = [
  { path: "public/Resume_Ahmed_Adil.pdf", sourceName: "Professional Resume" },
  {
    path: "public/anomaly-detection-report.pdf",
    sourceName: "NASA Telemetry Research Paper",
  },
  {
    path: "public/barn-challenge.pdf",
    sourceName: "ROS 2 BARN Challenge Report",
  },
];

async function ingest() {
  try {
    console.log("🚀 Starting Multi-Document Ingestion Pipeline...");
    let allDatabaseRows = [];

    // Loop through every document in your library
    for (const doc of documentsToIngest) {
      console.log(`\n📄 Processing: ${doc.sourceName}...`);

      const pdfPath = join(process.cwd(), doc.path);
      const pdfBuffer = await readFile(pdfPath).catch(() => null);

      if (!pdfBuffer) {
        console.warn(`⚠️ Could not find ${doc.path}. Skipping...`);
        continue; // Skip if the file isn't uploaded yet
      }

      // Extract Text
      const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer));
      const { text } = await extractText(pdf, { mergePages: true });
      if (!text.trim()) continue;

      // Fixed Word-Count Chunking
      const cleanText = text.replace(/\s+/g, " ").trim();
      const words = cleanText.split(" ");
      let currentChunk = [];
      let docChunks = [];

      for (const word of words) {
        currentChunk.push(word);
        if (currentChunk.length >= 60) {
          docChunks.push(currentChunk.join(" "));
          currentChunk = [];
        }
      }
      if (currentChunk.length > 0) docChunks.push(currentChunk.join(" "));

      console.log(
        `💡 Generated ${docChunks.length} chunks. Generating embeddings...`,
      );

      // Generate Embeddings and Tag the Source
      for (let i = 0; i < docChunks.length; i++) {
        const taggedContent = `[Source: ${doc.sourceName}] ${docChunks[i]}`;

        let success = false;
        let retries = 0;

        // Auto-retry loop for rate limits
        while (!success && retries < 5) {
          try {
            process.stdout.write(
              `   👉 Embedding chunk ${i + 1}/${docChunks.length} (Attempt ${retries + 1})...\r`,
            );

            const values = await getEmbedding(taggedContent);
            allDatabaseRows.push({ content: taggedContent, embedding: values });

            success = true;
            // Still keep a small baseline delay
            await delay(2000);
          } catch (err) {
            // Catch 429 Rate Limits AND Node.js network connection drops
            if (
              err.message?.includes("429") ||
              err.message?.includes("rate_limit") ||
              err.message?.includes("Jina error: 429") ||
              err.message?.includes("fetch failed") ||
              err.code === "UND_ERR_CONNECT_TIMEOUT"
            ) {
              process.stdout.write(
                `\n   ⚠️ Network/API bottleneck hit. Pausing for 15 seconds...\n`,
              );
              await delay(15000); // Wait 15 seconds
              retries++;
            } else {
              // If it's a completely different fatal error, throw it
              throw err;
            }
          }
        }

        if (!success) {
          throw new Error(`Failed to embed chunk ${i + 1} after 5 retries.`);
        }
      }
    }

    console.log(
      `\n\n4. [INSERT] Uploading ${allDatabaseRows.length} total chunks to Supabase...`,
    );

    // Clear old embeddings — required when switching embedding models
    console.log("🗑️  Clearing old embeddings from Supabase...");
    await supabase.from('documents').delete().neq('content', 'placeholder');

    const { error } = await supabase
      .from("documents")
      .insert(allDatabaseRows)
      .select();

    if (error) throw new Error(`Supabase DB Error: ${error.message}`);

    console.log(`🎉 Pipeline complete! Library synced to Supabase.`);
  } catch (err) {
    console.error("\n❌ INGESTION PIPELINE FAILED!");
    console.error(err.message || err);
  }
}

ingest();

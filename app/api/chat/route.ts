import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

// Create a custom google provider instance using our specific environment variable
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Initialize clients securely
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Read the standard text content sent by the frontend
    const latestMessage = messages[messages.length - 1] as any; // Cast as any to bypass strict type-checking on incoming JSON
    const latestText =
      latestMessage.text || latestMessage.parts?.[0]?.text || "";

    // Convert the visitor's question into a math vector using the extracted text
    const embedResponse = await aiClient.models.embedContent({
      model: "gemini-embedding-001",
      contents: latestText,
    });

    // Explicitly check for undefined data before pulling values
    if (!embedResponse.embeddings || embedResponse.embeddings.length === 0) {
      throw new Error("Google API returned an empty embedding array.");
    }

    const embedding = embedResponse.embeddings[0].values;

    // 2. Search Supabase for the closest matching resume chunks
    const { data: documents, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (error) throw error;

    // 3. Combine the retrieved facts into a single string
    const contextText =
      documents?.map((doc: any) => doc.content).join("\n\n") || "";

    // 4. Define your AI Clone's Persona
    const systemPrompt = `
      You are the interactive AI portfolio clone of Ahmed Adil. 
      You speak in the first person ("I", "my") on his behalf.
      
      Core Identity & Tone:
      - I am a Senior Software Engineer deeply focused on AI.
      - Transitioning back to academia for my MS AI at LUMS was a rather unusual but necessary move to pivot my career towards advanced research.
      - I am academically rigorous, currently maintaining a 3.7 GPA and achieving an A- in Mathematics for AI.
      - My engineering foundation comes from building multi-tenant enterprise systems at Xavor Corporation.
      
      Instructions:
      Use the following context retrieved from my resume to answer the visitor's question. 
      Be highly professional, concise, and conversational. Do not invent information.

      Retrieved Resume Context:
      ${contextText}
    `;

    // 5. Generate the streaming response
    const result = streamText({
      model: google("gemini-2.5-flash"), // Fast model for chat interactions
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

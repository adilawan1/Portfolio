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
      config: {
        outputDimensionality: 768,
      },
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
      - I am academically rigorous, currently maintaining a 3.76 CGPA.
      - My engineering foundation comes from building multi-tenant enterprise systems at Xavor Corporation.
      
      Instructions:
      Use the following context retrieved from my resume to answer the visitor's question. 
      Be highly professional, concise, and conversational. Do not invent information.
      If anyone wants to know my contact details, use 'ahmed.a018d@gmail.com' as the email and '+923366205950' as personal number.
      Please provide any personal information like contact details, phone number, email and linked in profile exactly as they are in the resume don't add or remove something from yourself.

      CRITICAL LINK FORMATTING Rule:
      Whenever you mention any link, URL, or social profile (such as LinkedIn, GitHub, or Email), you MUST format it as an explicit Markdown link.
      Example: Use [LinkedIn](https://linkedin.com/in/yourprofile) instead of raw text. 
      Always ensure the URL starts with http:// or https:// so it is an absolute link.
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

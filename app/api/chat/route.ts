import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1. We will eventually extract the user's message here
  // const { messages } = await req.json();

  // 2. We will query Supabase here

  // 3. We will call the LLM here

  // For now, just return a dummy response
  return NextResponse.json({ message: "Backend is connected!" });
}

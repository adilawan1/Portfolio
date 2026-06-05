"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function ChatBox() {
  // 1. Use the v4 'sendMessage' method
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 2. Send the message using the v4 syntax
    sendMessage({ text: input });
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col w-full max-w-2xl h-125 border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50 shadow-2xl">
      {/* Messages Display Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-slate-400 text-center mt-20">
            <p className="text-lg font-semibold text-slate-200">
              Hello! I am Ahmed's AI Clone.
            </p>
            <p className="mt-2 text-sm">
              Ask me about my engineering experience, projects, or MS AI
              research.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div
            className={`max-w-[90%] p-3 border-l-2 ${
              m.role === "user"
                ? "bg-slate-800/50 border-slate-400 text-slate-200 self-end text-right"
                : "bg-blue-900/10 border-blue-500 text-blue-100 self-start"
            }`}
          >
            <span className="font-mono text-[10px] tracking-wider uppercase mb-1 block opacity-50">
              {m.role === "user" ? "visitor@local:~$" : "system_agent@rag:~$"}
            </span>
            <p className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {m.parts?.map((p: any) => p.text).join("")}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="text-slate-500 text-sm p-2 animate-pulse">
            Retrieving context...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="p-4 border-t border-slate-700 bg-slate-900"
      >
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Can you tell me about your thesis?"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={status !== "ready" && status !== "error"}
          />
          <button
            type="submit"
            disabled={
              (status !== "ready" && status !== "error") || !input.trim()
            }
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

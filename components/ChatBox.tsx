"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatBox() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // NEW: Reference for the input box

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // NEW: Force focus back to input when streaming finishes
  useEffect(() => {
    if (status === "ready" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-300 font-mono text-sm select-none border-none">
      {/* TERMINAL DISPLAY PANEL */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="text-slate-500 text-xs border border-slate-900 p-3 bg-slate-900/20 rounded-sm">
            <p className="text-blue-400 font-bold mb-1">
              === CO-PILOT AGENT CORE INITIALIZED ===
            </p>
            <p>Ready to analyze high-dimensional vectors.</p>
            <p>
              Query me regarding my experience as a Software Engineer, MS AI
              research, or PhD goals.
            </p>
          </div>
        )}

        {/* MESSAGES LOOP */}
        {messages.map((m, index) => (
          <div
            key={m.id || index}
            className={`p-3 border-l-2 animate-fadeIn ${
              m.role === "user"
                ? "bg-slate-900/40 border-slate-500 text-slate-200"
                : "bg-blue-950/10 border-blue-500 text-blue-300"
            }`}
          >
            {/* Terminal Prompt Header */}
            <div className="flex justify-between items-center mb-1 opacity-40 text-[10px] tracking-wider uppercase select-none">
              <span>
                {m.role === "user" ? "guest@portfolio:~$" : "ahmed_bot@rag:~$"}
              </span>
              <span>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            {/* Message Body with Clickable Link Support */}
            <div className="whitespace-pre-wrap leading-relaxed text-sm selection:bg-blue-500/30 font-mono [&_a]:text-blue-400 [&_a]:underline [&_a]:hover:text-blue-300 [&_a]:cursor-pointer">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevents event bubbling
                    />
                  ),
                }}
              >
                {m.parts?.map((p: any) => p.text).join("")}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="text-blue-500 text-xs animate-pulse flex items-center gap-1 pl-1">
            <span>▋</span> <span>Executing retrieval sequence...</span>
          </div>
        )}
      </div>

      {/* TERMINAL INPUT PROMPT */}
      <form
        onSubmit={handleFormSubmit}
        className="border-t border-slate-800 bg-slate-900/40 p-3 flex items-center gap-2"
      >
        <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
        <input
          ref={inputRef} // Hooked up the ref
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isLoading ? "Streaming response..." : "Type system query..."
          }
          // REMOVED the disabled attribute here so it never loses focus!
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none font-mono text-sm"
          autoFocus // Grabs focus on initial page load
        />
        <button
          type="submit"
          disabled={status !== "ready" && status !== "error"}
          className="hidden" // Hiding the button to keep the terminal vibe pure, Enter key works!
        />
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox"; // Your existing chat component

export default function PortfolioDashboard() {
  // We track which project the user is currently viewing
  const [activeProject, setActiveProject] = useState("nasa-telemetry");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 md:p-8 flex flex-col md:flex-row gap-6">
      {/* LEFT PANEL: The Academic/Visual Showcase (65% width) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Navigation/Telemetry Header */}
        <header className="border-b border-slate-800 pb-4 flex gap-4">
          <button
            onClick={() => setActiveProject("nasa-telemetry")}
            className={`px-4 py-2 font-mono text-sm border ${activeProject === "nasa-telemetry" ? "border-blue-500 text-blue-400 bg-blue-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [1] NASA Telemetry
          </button>
          <button
            onClick={() => setActiveProject("neuro-focus")}
            className={`px-4 py-2 font-mono text-sm border ${activeProject === "neuro-focus" ? "border-emerald-500 text-emerald-400 bg-emerald-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [2] Neuro Focus Guard
          </button>
        </header>

        {/* Dynamic Project Content Area */}
        <main className="flex-1 bg-slate-900/50 border border-slate-800 p-8 rounded-sm overflow-y-auto">
          {activeProject === "nasa-telemetry" && <NasaTelemetryProject />}
          {activeProject === "neuro-focus" && <NeuroFocusProject />}
        </main>
      </div>

      {/* RIGHT PANEL: The Persistent AI Co-Pilot (35% width) */}
      <aside className="w-full md:w-[400px] xl:w-[450px] flex flex-col h-[85vh] sticky top-8">
        <div className="border border-slate-800 bg-slate-900/30 p-3 mb-2 flex justify-between items-center text-xs font-mono">
          <span className="text-blue-500 animate-pulse">● SYSTEM ONLINE</span>
          <span className="text-slate-500">VECTOR_DIM: 768</span>
        </div>

        {/* We inject your working ChatBox here, but tell it to fill the height */}
        <div className="flex-1 bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <ChatBox />
        </div>
      </aside>
    </div>
  );
}

// --- PROJECT COMPONENTS ---

function NasaTelemetryProject() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-slate-100">
        Unsupervised Anomaly Detection in High-Dimensional Telemetry
      </h1>
      <div className="text-sm font-mono text-blue-400 border-l-2 border-blue-500 pl-4 py-1">
        Tech Stack: Python, TensorFlow, LaTeX | Role: AI Researcher
      </div>
      <p className="leading-relaxed text-slate-400">
        <strong>Abstract:</strong> This research explores the application of
        Autoencoder architectures to detect unsupervised anomalies in NASA
        spacecraft telemetry datasets...
      </p>
      {/* Placeholder for your actual system diagrams or interactive charts */}
      <div className="h-64 border border-slate-700 border-dashed flex items-center justify-center text-slate-600 font-mono text-sm bg-slate-950">
        [ Insert Interactive SVG Architecture or Graph Here ]
      </div>
    </div>
  );
}

function NeuroFocusProject() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-slate-100">Neuro Focus Guard</h1>
      <div className="text-sm font-mono text-emerald-400 border-l-2 border-emerald-500 pl-4 py-1">
        Tech Stack: Electron, React, MediaPipe | Role: Full-Stack & ML Engineer
      </div>
      <p className="leading-relaxed text-slate-400">
        A desktop application utilizing computer vision to detect user
        distraction in real-time, designed to improve deep work sessions.
      </p>
      {/* Placeholder for your UI screenshots */}
      <div className="h-64 border border-slate-700 border-dashed flex items-center justify-center text-slate-600 font-mono text-sm bg-slate-950">
        [ Insert Application Screenshot Mockups Here ]
      </div>
    </div>
  );
}

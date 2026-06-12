"use client";

import { useState, useEffect } from "react";
import ChatBox from "@/components/ChatBox";
import PDFPreview from "@/components/PDFPreview";
import Image from "next/image";

function TypewriterText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 55);
    return () => clearInterval(timer);
  }, [text]);
  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse opacity-70">▌</span>}
    </span>
  );
}

export default function PortfolioDashboard() {
  const [activeProject, setActiveProject] = useState("profile");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="scanlines min-h-screen bg-slate-950 bg-grid text-slate-300 font-sans p-4 lg:p-8 flex flex-col lg:flex-row gap-6 relative overflow-x-hidden">
      {/* LEFT PANEL: The Academic/Visual Showcase */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        {/* Navigation/Telemetry Header - Changed md style overrides to lg */}
        <header className="border-b border-slate-800 pb-4 flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <button
            onClick={() => setActiveProject("profile")}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${activeProject === "profile" ? "border-purple-500 text-purple-400 bg-purple-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [0] System.Profile
          </button>
          <button
            onClick={() => setActiveProject("nasa-telemetry")}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${activeProject === "nasa-telemetry" ? "border-blue-500 text-blue-400 bg-blue-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [1] NASA Telemetry
          </button>
          <button
            onClick={() => setActiveProject("ros2-barn")}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${activeProject === "ros2-barn" ? "border-emerald-500 text-emerald-400 bg-emerald-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [2] BARN Challenge ROS 2
          </button>
          <button
            onClick={() => setActiveProject("certifications")}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${activeProject === "certifications" ? "border-amber-500 text-amber-400 bg-amber-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [3] Certifications
          </button>
          <button
            onClick={() => setActiveProject("awards")}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${activeProject === "awards" ? "border-rose-500 text-rose-400 bg-rose-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [4] Awards
          </button>
        </header>

        {/* Dynamic Project Content Area */}
        <main
          key={activeProject}
          className="flex-1 bg-slate-900/50 border border-slate-800 p-4 lg:p-8 rounded-sm overflow-y-auto animate-fadeIn"
        >
          {activeProject === "profile" && <ProfileResume />}
          {activeProject === "nasa-telemetry" && <NasaTelemetryProject />}
          {activeProject === "ros2-barn" && <ROS2Project />}
          {activeProject === "certifications" && <CertificationsSection />}
          {activeProject === "awards" && <AwardsSection />}
        </main>
      </div>

      {/* RIGHT PANEL: Desktop Persistent AI Co-Pilot */}
      {/* Changed hidden md:flex to hidden lg:flex to prevent the side panel from rendering too early */}
      <aside className="hidden lg:flex w-full lg:w-[380px] xl:w-[450px] flex-col h-[85vh] sticky top-8">
        <div className="border border-slate-800 bg-slate-900/30 p-3 mb-2 flex justify-between items-center text-xs font-mono">
          <span className="text-blue-500 animate-pulse flex items-center gap-1.5">
            <span>●</span>
            <span>AI Assistant · Ask me anything</span>
          </span>
          <span className="text-slate-600">RAG · 768-dim</span>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <ChatBox />
        </div>
      </aside>

      {/* ========================================= */}
      {/* MOBILE/TABLET: SLIDING CHAT DRAWER       */}
      {/* ========================================= */}
      {/* Changed md:hidden to lg:hidden */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isChatOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 h-[85vh] bg-slate-950 border-t border-slate-700 rounded-t-2xl transition-transform duration-300 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${isChatOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-slate-300">
                AI Assistant · Ask me anything
              </span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white font-mono text-[10px] tracking-widest px-3 py-1.5 border border-slate-700 rounded bg-slate-800 transition-colors"
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="flex-1 overflow-hidden p-1">
            <ChatBox />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MOBILE/TABLET: FLOATING ACTION BUTTON    */}
      {/* ========================================= */}
      {/* Changed md:hidden to lg:hidden */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`lg:hidden fixed bottom-6 right-6 z-40 bg-blue-900/80 text-blue-400 border border-blue-500/50 backdrop-blur-md rounded-full px-5 py-4 shadow-xl hover:bg-blue-800 transition-all duration-300 flex items-center justify-center font-mono text-xs group ${isChatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        Ask my AI
      </button>
    </div>
  );
}

// --- PROJECT COMPONENTS ---

function NasaTelemetryProject() {
  const techStack = [
    "Python",
    "PyTorch",
    "TensorFlow",
    "CUDA",
    "NumPy",
    "Pandas",
    "Scikit-Learn",
    "Matplotlib",
    "Google Colab",
    "LaTeX",
  ];
  const contributions = [
    "Proposed a hybrid LSTM + TCN autoencoder with a learned per-timestep attention gate, fusing two encoder streams into a single anomaly representation.",
    "Introduced dual scoring: combines input-space reconstruction error with latent-space Mahalanobis distance to catch anomalies that either signal misses alone.",
    "Added an anomaly-masked dynamic threshold that prevents sustained anomalies from inflating the running baseline — a common failure mode in prior work.",
    "Evaluated on 6 NASA SMAP/MSL channels, achieving perfect recall on every model and a mean PA-F1 of 0.953 — +0.178 above the CNN baseline.",
  ];

  return (
    <div className="space-y-6">
      {/* Title + context */}
      <div>
        <h1 className="text-3xl font-serif text-slate-100 mb-3">
          Unsupervised Anomaly Detection in High-Dimensional Telemetry
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-blue-500 pl-4">
          A hybrid deep learning system that detects sensor anomalies in NASA
          spacecraft data without any labelled examples — achieving perfect
          recall across all tested channels and a Point-Adjusted F1 of 0.953.
        </p>
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest self-center mr-1">
          Stack:
        </span>
        {techStack.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 bg-blue-950/30 border border-blue-800/40 text-blue-300 text-[10px] font-mono rounded-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Point-Adj F1",
            value: "0.953",
            color: "text-blue-400",
            border: "border-blue-500/40",
          },
          {
            label: "Recall",
            value: "1.00",
            color: "text-emerald-400",
            border: "border-emerald-500/40",
          },
          {
            label: "F1 Lift vs Baseline",
            value: "+0.178",
            color: "text-purple-400",
            border: "border-purple-500/40",
          },
          {
            label: "SMAP/MSL Channels",
            value: "6",
            color: "text-slate-300",
            border: "border-slate-600/40",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`border ${s.border} bg-slate-900/40 p-3 rounded-sm text-center`}
          >
            <div className={`text-2xl font-mono font-bold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture diagram */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden border border-slate-800">
          <Image
            src="/anomaly-detection-architecture.png"
            alt="Hybrid LSTM-TCN Autoencoder Architecture"
            fill
            className="object-contain filter contrast-125 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>
        <figcaption className="text-xs font-mono text-slate-500 mt-3 border-t border-slate-800 pt-2">
          Fig. Hybrid LSTM-TCN autoencoder architecture with learned attention
          gate.
        </figcaption>
      </figure>

      {/* Key Contributions */}
      <div className="border border-slate-800 bg-slate-900/20 p-5 rounded-sm">
        <h2 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-4">
          Key Contributions
        </h2>
        <ul className="space-y-3">
          {contributions.map((c, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-slate-400 leading-relaxed"
            >
              <span className="text-blue-600 font-mono shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Abstract (full academic text) */}
      <details className="group border border-slate-800 rounded-sm">
        <summary className="px-4 py-3 text-xs font-mono text-slate-500 cursor-pointer hover:text-slate-300 transition-colors list-none flex justify-between items-center">
          <span>Full Abstract (IEEE Manuscript)</span>
          <span className="group-open:rotate-90 transition-transform duration-200">
            ›
          </span>
        </summary>
        <p className="px-4 pb-4 pt-2 text-sm leading-relaxed text-slate-400 border-t border-slate-800">
          Industrial and spacecraft telemetry streams generate vast volumes of
          multivariate sensor data, but labelled anomalies are rare or absent.
          We study purely unsupervised reconstruction-based detection on the
          NASA SMAP/MSL telemetry benchmark and propose a hybrid temporal
          autoencoder that runs an LSTM and a Temporal Convolutional Network
          (TCN) encoder in parallel, fuses their per-timestep representations
          with a learned attention gate, and scores anomalies by combining
          input-space reconstruction error with a latent-space Mahalanobis
          distance (dual scoring). We further introduce an anomaly-masked
          dynamic threshold that prevents sustained anomalies from inflating the
          running baseline. Across six representative SMAP and MSL channels, the
          dual score yields perfect recall on every model evaluated and lifts
          the seq-to-seq LSTM autoencoder to a mean Point-Adjusted F1 of 0.953,
          substantially above the CNN baseline (0.775). The hybrid model reaches
          0.846 and is the most consistent recall-1.0 detector, showing that
          fusing reconstruction error with latent distance catches anomalies
          that either signal misses alone.
        </p>
      </details>

      {/* PDF bar */}
      <div className="flex flex-wrap gap-4 p-4 border border-slate-800 bg-slate-950/60 rounded-sm items-center justify-between">
        <div className="text-xs font-mono text-slate-400">
          <span className="text-slate-300">NASA_Telemetry_Report.pdf</span>
          <span className="text-slate-600 ml-2">2.4 MB · IEEE Manuscript</span>
        </div>
        <div className="flex gap-2">
          <a
            href="/anomaly-detection-report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 font-mono text-xs border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
          >
            View PDF
          </a>
          <a
            href="/anomaly-detection-report.pdf"
            download
            className="px-3 py-1.5 font-mono text-xs bg-blue-900/20 border border-blue-800 text-blue-400 hover:bg-blue-900/40 transition-colors"
          >
            ↓ Download
          </a>
        </div>
      </div>
    </div>
  );
}

function ROS2Project() {
  const techStack = [
    "Python",
    "ROS 2",
    "OpenCV",
    "NumPy",
    "cv_bridge",
    "rclpy",
    "SLAM",
  ];
  const contributions = [
    "Built a vision-based masking pipeline that segments obstacles and extracts traversable floor regions from RGB images, using a centroid proportional controller for steering.",
    "Implemented a VFH-inspired LiDAR processor: constructs an inverse-distance weighted polar histogram and steers toward the midpoint of the widest free-space valley.",
    "Fused both perception streams via a weighted combination — providing fallback robustness when one sensor is occluded or unreliable.",
    "Integrated SLAM for global mapping and an exploration-driven scoring function to escape local minima in dense obstacle fields.",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-100 mb-3">
          Camera-LiDAR Autonomous Navigation in BARN using ROS 2
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-emerald-500 pl-4">
          An autonomous robot that navigates dense cluttered environments by
          fusing RGB camera and LiDAR data in real time — clearing 41 of 50 BARN
          benchmark worlds with an 82% success rate.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest self-center mr-1">
          Stack:
        </span>
        {techStack.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-[10px] font-mono rounded-sm"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Worlds Passed",
            value: "41/50",
            color: "text-emerald-400",
            border: "border-emerald-500/40",
          },
          {
            label: "Success Rate",
            value: "82%",
            color: "text-blue-400",
            border: "border-blue-500/40",
          },
          {
            label: "BARN Avg Score",
            value: "0.324",
            color: "text-purple-400",
            border: "border-purple-500/40",
          },
          {
            label: "Sensor Streams",
            value: "2",
            color: "text-slate-300",
            border: "border-slate-600/40",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`border ${s.border} bg-slate-900/40 p-3 rounded-sm text-center`}
          >
            <div className={`text-2xl font-mono font-bold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden border border-slate-800">
          <Image
            src="/VFH.png"
            alt="Vector Field Histogram — free-space valley detection"
            fill
            className="object-contain filter contrast-125 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>
        <figcaption className="text-xs font-mono text-slate-500 mt-3 border-t border-slate-800 pt-2">
          Fig. Vector Field Histogram (VFH) polar histogram with free-space
          valley selection.
        </figcaption>
      </figure>

      <div className="border border-slate-800 bg-slate-900/20 p-5 rounded-sm">
        <h2 className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-4">
          Key Contributions
        </h2>
        <ul className="space-y-3">
          {contributions.map((c, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-slate-400 leading-relaxed"
            >
              <span className="text-emerald-600 font-mono shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <details className="group border border-slate-800 rounded-sm">
        <summary className="px-4 py-3 text-xs font-mono text-slate-500 cursor-pointer hover:text-slate-300 transition-colors list-none flex justify-between items-center">
          <span>Full Abstract (IEEE Manuscript)</span>
          <span className="group-open:rotate-90 transition-transform duration-200">
            ›
          </span>
        </summary>
        <p className="px-4 pb-4 pt-2 text-sm leading-relaxed text-slate-400 border-t border-slate-800">
          This paper presents a ROS 2–based autonomous navigation system for the
          Benchmark Autonomous Robot Navigation (BARN) environment, combining
          vision and LiDAR sensing for robust navigation in cluttered spaces.
          Our vision-based masking pipeline segments obstacles and extracts
          traversable floor regions from RGB images, using a centroid-based
          proportional controller to guide the robot. Simultaneously, LiDAR data
          is processed via a Vector Field Histogram (VFH)–inspired approach.
          This method constructs an inverse-distance weighted polar histogram to
          identify contiguous free-space regions, selecting the midpoint of the
          widest feasible valley as the optimal path. The final steering command
          is a weighted fusion of these dual perception streams, ensuring
          robustness under varying environmental conditions. To overcome local
          minima, we incorporate SLAM for global mapping and an
          exploration-driven scoring function for effective recovery. The system
          achieves an average score of 0.324 on the BARN benchmark and
          successfully navigates 41 out of 50 worlds (250–299) of the test
          worlds, demonstrating significant effectiveness in handling narrow
          passages and occlusions.
        </p>
      </details>

      <div className="flex flex-wrap gap-4 p-4 border border-slate-800 bg-slate-950/60 rounded-sm items-center justify-between">
        <div className="text-xs font-mono text-slate-400">
          <span className="text-slate-300">ros2_BARN_Report.pdf</span>
          <span className="text-slate-600 ml-2">2.4 MB · IEEE Manuscript</span>
        </div>
        <div className="flex gap-2">
          <a
            href="/barn-challenge.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 font-mono text-xs border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
          >
            View PDF
          </a>
          <a
            href="/barn-challenge.pdf"
            download
            className="px-3 py-1.5 font-mono text-xs bg-emerald-900/20 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/40 transition-colors"
          >
            ↓ Download
          </a>
        </div>
      </div>
    </div>
  );
}

// --- CERTIFICATIONS ---

type CertType = "image" | "pdf";
interface Cert {
  file: string;
  name: string;
  issuer: string;
  date: string;
  type: CertType;
  accent: string;
}

function CertificationsSection() {
  // ── Fill in the name/issuer/date for the 6 PDF entries below ──
  const certs: Cert[] = [
    {
      file: "/CERTIFICATE_5.pdf",
      name: "AI for everyone",
      issuer: "DeepLearning.AI · Coursera",
      date: "Apr 2024",
      type: "pdf",
      accent: "blue",
    },
    {
      file: "/CERTIFICATE_6.pdf",
      name: "Back End Development and APIs",
      issuer: "FreeCodeCamp",
      date: "March 2024",
      type: "pdf",
      accent: "blue",
    },
    {
      file: "/CERTIFICATE_7.pdf",
      name: "Legacy JavaScript Algorithms and Data Structures",
      issuer: "FreeCodeCamp",
      date: "Jan 2024",
      type: "pdf",
      accent: "blue",
    },
    {
      file: "/CERTIFICATE_8.jpeg",
      name: "AWS Cloud Technical Essentials",
      issuer: "Amazon Web Services · Coursera",
      date: "Jul 2023",
      type: "image",
      accent: "amber",
    },
    {
      file: "/CERTIFICATE_9.jpg",
      name: "React + Redux",
      issuer: "Sololearn",
      date: "Mar 2023",
      type: "image",
      accent: "emerald",
    },
    {
      file: "/CERTIFICATE_2.pdf",
      name: "Data Science for Everyone",
      issuer: "Datacamp",
      date: "March 2022",
      type: "pdf",
      accent: "blue",
    },
    {
      file: "/CERTIFICATE_1.pdf",
      name: " Data Manipulation in Python: Master Python, Numpy & Pandas",
      issuer: "Udemy",
      date: "Feb 2022",
      type: "pdf",
      accent: "blue",
    },
    {
      file: "/CERTIFICATE_3.jpeg",
      name: "Neural Networks and Deep Learning",
      issuer: "DeepLearning.AI · Coursera",
      date: "Feb 2022",
      type: "image",
      accent: "purple",
    },
    {
      file: "/CERTIFICATE_4.pdf",
      name: "HTML, CSS, and Javascript for Web Developers",
      issuer: "John Hopkins University",
      date: "Sep 2021",
      type: "pdf",
      accent: "blue",
    },
  ];

  const accentClasses: Record<
    string,
    { border: string; text: string; bg: string }
  > = {
    blue: {
      border: "border-blue-500/40",
      text: "text-blue-400",
      bg: "bg-blue-950/20",
    },
    purple: {
      border: "border-purple-500/40",
      text: "text-purple-400",
      bg: "bg-purple-950/20",
    },
    emerald: {
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      bg: "bg-emerald-950/20",
    },
    amber: {
      border: "border-amber-500/40",
      text: "text-amber-400",
      bg: "bg-amber-950/20",
    },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-serif text-slate-100 mb-3">
          Certifications
        </h1>
        <p className="text-sm text-slate-400 border-l-2 border-amber-500 pl-4">
          Verified credentials across AI &amp; deep learning, cloud
          infrastructure, and software engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => {
          const ac = accentClasses[cert.accent];
          if (cert.type === "image") {
            return (
              <a
                key={cert.file}
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col overflow-hidden border ${ac.border} rounded-sm bg-slate-900/40 hover:bg-slate-900/70 transition-all duration-300`}
              >
                <div className="relative h-44 overflow-hidden bg-white/5">
                  <Image
                    src={cert.file}
                    alt={cert.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div
                    className={`absolute top-2 right-2 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm ${ac.bg} ${ac.text} border ${ac.border}`}
                  >
                    verified
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col gap-1">
                  <div className="text-xs font-mono font-semibold text-slate-100 leading-snug">
                    {cert.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {cert.issuer}
                  </div>
                  {cert.date && (
                    <div
                      className={`text-[10px] font-mono mt-auto pt-2 ${ac.text}`}
                    >
                      {cert.date}
                    </div>
                  )}
                </div>
              </a>
            );
          }
          return (
            <div
              key={cert.file}
              className={`flex flex-col overflow-hidden border ${ac.border} rounded-sm bg-slate-900/40`}
            >
              {/* Rendered PDF first-page preview */}
              <div className="relative h-44 overflow-hidden bg-white group">
                <PDFPreview
                  url={cert.file}
                  className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className={`absolute top-2 right-2 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${ac.bg} ${ac.text} border ${ac.border}`}>
                  pdf
                </div>
              </div>
              {/* Action bar */}
              <div className="flex gap-2 p-3">
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-3 py-1.5 font-mono text-xs border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
                >
                  View
                </a>
                <a
                  href={cert.file}
                  download
                  className={`flex-1 text-center px-3 py-1.5 font-mono text-xs ${ac.bg} border ${ac.border} ${ac.text} hover:opacity-80 transition-opacity`}
                >
                  ↓ Save
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- AWARDS & RECOGNITION ---

interface Award {
  file: string;
  title: string;
  event: string;
  date: string;
  description?: string;
}

function AwardsSection() {
  // ── Add your award photos to public/ and fill in entries here ──
  // Name your files AWARD_1.jpg, AWARD_2.jpg, etc. (jpg/jpeg/png/webp all work)
  const awards: Award[] = [
    // Example entry — duplicate and fill in for each photo:
    {
      file: "/Award_1.jpg",
      title: "Employee Recognition Award",
      event: "Xavor Corporation",
      date: "2025",
      description: "Recognition of efforts put in through out the year",
    },
    {
      file: "/Award_3.jpeg",
      title: "Certificate of Appreciation",
      event: "Xavor Corporation",
      date: "2024",
      description: "On providing exceptional customer services to the clients",
    },
    {
      file: "/Award_2.jpg",
      title: "Certificate of Appreciation",
      event: "Xavor Corporation",
      date: "2023",
      description: "On providing exception customer services to the clients",
    },
    {
      file: "/Award_4.jpeg",
      title: "Certificate of Excellence",
      event: "Xavor Corporation",
      date: "2022-2023",
      description: "In the recognition of excellent performance",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-serif text-slate-100 mb-3">
          Awards &amp; Recognition
        </h1>
        <p className="text-sm text-slate-400 border-l-2 border-rose-500 pl-4">
          Excellence awards, recognition events, and professional achievements.
        </p>
      </div>

      {awards.length === 0 ? (
        <div className="border border-dashed border-slate-700 rounded-sm p-10 text-center space-y-3">
          <div className="text-slate-600 font-mono text-xs uppercase tracking-widest">
            No photos added yet
          </div>
          <p className="text-slate-500 text-xs font-mono max-w-sm mx-auto leading-relaxed">
            Copy your award photos into{" "}
            <span className="text-rose-400">public/</span> as{" "}
            <span className="text-rose-400">AWARD_1.jpg</span>,{" "}
            <span className="text-rose-400">AWARD_2.jpg</span>, etc., then fill
            in the <span className="text-rose-400">awards</span> array in{" "}
            <span className="text-rose-400">page.tsx</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award) => (
            <a
              key={award.file}
              href={award.file}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden border border-rose-500/30 hover:border-rose-500/60 rounded-sm bg-slate-900/40 transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden bg-slate-800">
                <Image
                  src={award.file}
                  alt={award.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                {/* Date badge */}
                <div className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-rose-950/60 text-rose-400 border border-rose-500/40">
                  {award.date}
                </div>
              </div>
              {/* Caption */}
              <div className="p-3 flex flex-col gap-1">
                <div className="text-xs font-mono font-semibold text-slate-100 leading-snug">
                  {award.title}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {award.event}
                </div>
                {award.description && (
                  <div className="text-[10px] font-mono text-slate-600 mt-1 leading-relaxed">
                    {award.description}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// --- INTERACTIVE RESUME ---

function ProfileResume() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Hero ── */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-serif text-slate-100 mb-2 animate-glitch cursor-default select-none">
          Ahmed Adil
        </h1>
        <div className="text-sm font-mono text-purple-400 border-l-2 border-purple-500 pl-4 py-1 mb-4">
          <TypewriterText text="Senior Software Engineer & AI Researcher" />
        </div>
        <p className="text-slate-400 leading-relaxed max-w-2xl">
          Four years shipping enterprise software at scale, now applying that
          production mindset to AI research at LUMS. I bridge rigorous ML
          research with systems that run in production — from multi-tenant SaaS
          platforms handling 20+ clients to autonomous navigation pipelines that
          cleared 82% of benchmark worlds.
        </p>

        {/* ── Contact & Social Links ── */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            {
              label: "ahmed.a018d@gmail.com",
              href: "mailto:ahmed.a018d@gmail.com",
            },
            { label: "+92 336 620 5950", href: "tel:+923366205950" },
            // TODO: replace YOUR_USERNAME and YOUR_HANDLE with your real profiles
            { label: "GitHub →", href: "https://github.com/adilawan1" },
            {
              label: "LinkedIn →",
              href: "https://linkedin.com/in/ahmed-adil-07b4141bb",
            },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center px-3 py-1.5 text-[11px] font-mono border border-slate-700 hover:border-purple-500/60 text-slate-400 hover:text-purple-300 transition-all duration-200 rounded-sm"
            >
              {label}
            </a>
          ))}
          <a
            href="/Resume_Ahmed_Adil.pdf"
            download
            className="inline-flex items-center px-3 py-1.5 text-[11px] font-mono bg-purple-900/20 border border-purple-700/60 text-purple-300 hover:bg-purple-900/40 transition-all duration-200 rounded-sm"
          >
            ↓ Resume.pdf
          </a>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            value: "4 yrs",
            label: "Industry Experience",
            color: "text-emerald-400",
            border: "border-emerald-500/30",
          },
          {
            value: "3.76",
            label: "MS AI CGPA at LUMS",
            color: "text-blue-400",
            border: "border-blue-500/30",
          },
          {
            value: "20+",
            label: "Enterprise Clients Served",
            color: "text-purple-400",
            border: "border-purple-500/30",
          },
          {
            value: "2",
            label: "Research Papers",
            color: "text-slate-300",
            border: "border-slate-600/30",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`border ${s.border} bg-slate-900/40 p-3 rounded-sm text-center`}
          >
            <div className={`text-2xl font-mono font-bold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Academic + Experience ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
          <h2 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-4">
            Academic
          </h2>
          <div className="space-y-3 font-mono text-sm">
            <div>
              <div className="text-slate-200 font-semibold">
                MS Artificial Intelligence
              </div>
              <div className="text-slate-500 text-xs">
                LUMS · Final Year · CGPA 3.76 / 4.0
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">
              Research focus: unsupervised anomaly detection in time-series,
              autonomous robot navigation, and large language model
              applications.
            </div>
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
          <h2 className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-4">
            Experience
          </h2>
          <div className="font-mono text-sm">
            <div className="text-slate-200 font-semibold">
              Senior Software Engineer
            </div>
            <div className="text-slate-500 text-xs mb-3">
              Xavor Corporation · 2020 – 2024
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              {[
                "Architected multi-tenant SaaS platforms serving 20+ enterprise clients",
                "Integrated Auth0 identity federation across .NET APIs and React Native",
                "Delivered Kentico Headless CMS solutions with custom REST API layers",
                "Led full-stack feature delivery across B2B and B2C product lines",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emerald-600 shrink-0 mt-0.5">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Skills Matrix ── */}
      <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
        <h2 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-5">
          Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              category: "Languages",
              color: "text-blue-400",
              items: ["Python", "TypeScript", "JavaScript", "C++"],
            },
            {
              category: "AI / ML",
              color: "text-purple-400",
              items: [
                "PyTorch",
                "TensorFlow",
                "LangChain",
                "RAG",
                "Transformers",
                "CUDA",
              ],
            },
            {
              category: "Web & Backend",
              color: "text-emerald-400",
              items: ["React", "Next.js", "Node.js", "REST APIs", "Auth0"],
            },
            {
              category: "Robotics",
              color: "text-amber-400",
              items: ["ROS 2", "OpenCV", "SLAM", "LiDAR", "cv_bridge"],
            },
            {
              category: "Infrastructure",
              color: "text-slate-300",
              items: [
                "Supabase",
                "PostgreSQL",
                "Kentico CMS",
                "Git",
                "Google Colab",
              ],
            },
            {
              category: "Research Methods",
              color: "text-red-400",
              items: [
                "Anomaly Detection",
                "Computer Vision",
                "Autonomous Nav",
                "LaTeX",
              ],
            },
          ].map(({ category, color, items }) => (
            <div key={category}>
              <div
                className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${color}`}
              >
                {category}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 bg-slate-800/60 text-slate-300 text-[10px] font-mono border border-slate-700/60 rounded-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── What I Build ── */}
      <div>
        <h2 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">
          What I Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Full-Stack Systems",
              border: "border-blue-500/30 hover:border-blue-500/60",
              accent: "text-blue-400",
              bg: "bg-blue-950/10",
              body: "End-to-end web applications built for scale — multi-tenant SaaS, headless CMS integrations, identity management, and production-ready APIs.",
            },
            {
              title: "AI / ML Integration",
              border: "border-purple-500/30 hover:border-purple-500/60",
              accent: "text-purple-400",
              bg: "bg-purple-950/10",
              body: "RAG pipelines, LLM-powered product features, custom embedding systems, and intelligent agents integrated into existing software.",
            },
            {
              title: "Research & Prototyping",
              border: "border-emerald-500/30 hover:border-emerald-500/60",
              accent: "text-emerald-400",
              bg: "bg-emerald-950/10",
              body: "Applied ML research, rapid prototyping of novel architectures, and paper-ready experiments in deep learning and autonomous systems.",
            },
          ].map(({ title, border, accent, bg, body }) => (
            <div
              key={title}
              className={`border ${border} ${bg} p-4 rounded-sm transition-colors duration-300`}
            >
              <div
                className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ${accent}`}
              >
                {title}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

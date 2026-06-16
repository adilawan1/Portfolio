"use client";

import { useState, useEffect, useRef } from "react";
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
  const [activeTab, setActiveTab] = useState("profile");
  const [workSubTab, setWorkSubTab] = useState("enterprise");
  const [academicSubTab, setAcademicSubTab] = useState("nasa-telemetry");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const dark = saved !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("light", !dark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", !next);
      localStorage.setItem("portfolio-theme", next ? "dark" : "light");
      return next;
    });
  };

  const scrollToTop = () => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    scrollToTop();
  };

  const handleSubTabChange = (
    setter: (s: string) => void,
    tab: string
  ) => {
    setter(tab);
    scrollToTop();
  };

  return (
    <div className="scanlines min-h-screen bg-slate-950 bg-grid text-slate-300 font-sans p-4 lg:p-8 flex flex-col lg:flex-row gap-6 relative overflow-x-hidden">
      {/* LEFT PANEL: The Academic/Visual Showcase */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        {/* Navigation/Telemetry Header */}
        <div className="relative">
          <header className="border-b border-slate-800 pb-4 flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <button
              onClick={() => handleTabChange("profile")}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${activeTab === "profile" ? "border-purple-500 text-purple-400 bg-purple-900/20" : "border-slate-800 hover:border-slate-600"}`}
            >
              [0] System.Profile
            </button>
            <button
              onClick={() => handleTabChange("work")}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${activeTab === "work" ? "border-cyan-500 text-cyan-400 bg-cyan-900/20" : "border-slate-800 hover:border-slate-600"}`}
            >
              [1] Work Experience
            </button>
            <button
              onClick={() => handleTabChange("academic")}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${activeTab === "academic" ? "border-blue-500 text-blue-400 bg-blue-900/20" : "border-slate-800 hover:border-slate-600"}`}
            >
              [2] Academic Projects
            </button>
            <button
              onClick={() => handleTabChange("certifications")}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${activeTab === "certifications" ? "border-amber-500 text-amber-400 bg-amber-900/20" : "border-slate-800 hover:border-slate-600"}`}
            >
              [3] Certifications
            </button>
            <button
              onClick={() => handleTabChange("awards")}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${activeTab === "awards" ? "border-rose-500 text-rose-400 bg-rose-900/20" : "border-slate-800 hover:border-slate-600"}`}
            >
              [4] Awards
            </button>
          </header>
          {/* Right-edge fade — signals more tabs are off-screen on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-linear-to-l from-slate-950 to-transparent lg:hidden" />
        </div>

        {/* Dynamic Project Content Area */}
        <main
          ref={mainRef}
          key={activeTab}
          className="flex-1 bg-slate-900/50 border border-slate-800 p-4 lg:p-8 rounded-sm overflow-y-auto animate-fadeIn"
        >
          {activeTab === "profile" && <ProfileResume />}

          {activeTab === "work" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
                <button
                  onClick={() => handleSubTabChange(setWorkSubTab, "enterprise")}
                  className={`px-3 py-1.5 font-mono text-xs border transition-colors rounded-sm ${workSubTab === "enterprise" ? "border-cyan-500 text-cyan-400 bg-cyan-900/20" : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"}`}
                >
                  ↳ Enterprise Healthcare Platform
                </button>
                <button
                  onClick={() => handleSubTabChange(setWorkSubTab, "careers-pipeline")}
                  className={`px-3 py-1.5 font-mono text-xs border transition-colors rounded-sm ${workSubTab === "careers-pipeline" ? "border-amber-500 text-amber-400 bg-amber-900/20" : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"}`}
                >
                  ↳ Careers Job Pipeline
                </button>
              </div>
              <div key={workSubTab} className="animate-fadeIn">
                {workSubTab === "enterprise" && <EnterpriseHealthcarePlatform />}
                {workSubTab === "careers-pipeline" && <CareersLambdas />}
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
                <button
                  onClick={() => handleSubTabChange(setAcademicSubTab, "nasa-telemetry")}
                  className={`px-3 py-1.5 font-mono text-xs border transition-colors rounded-sm ${academicSubTab === "nasa-telemetry" ? "border-blue-500 text-blue-400 bg-blue-900/20" : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"}`}
                >
                  ↳ NASA Telemetry
                </button>
                <button
                  onClick={() => handleSubTabChange(setAcademicSubTab, "ros2-barn")}
                  className={`px-3 py-1.5 font-mono text-xs border transition-colors rounded-sm ${academicSubTab === "ros2-barn" ? "border-emerald-500 text-emerald-400 bg-emerald-900/20" : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"}`}
                >
                  ↳ BARN Challenge ROS 2
                </button>
              </div>
              <div key={academicSubTab} className="animate-fadeIn">
                {academicSubTab === "nasa-telemetry" && <NasaTelemetryProject />}
                {academicSubTab === "ros2-barn" && <ROS2Project />}
              </div>
            </div>
          )}

          {activeTab === "certifications" && <CertificationsSection />}
          {activeTab === "awards" && <AwardsSection />}
        </main>
      </div>

      {/* RIGHT PANEL: Desktop Persistent AI Co-Pilot */}
      {/* Changed hidden md:flex to hidden lg:flex to prevent the side panel from rendering too early */}
      <aside className="hidden lg:flex w-full lg:w-115 xl:w-140 2xl:w-160 flex-col h-[85vh] sticky top-8">
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
        className={`mobile-backdrop fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isChatOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
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
              className="text-slate-400 hover:text-slate-100 font-mono text-[10px] tracking-widest px-3 py-1.5 border border-slate-700 rounded bg-slate-800 transition-colors"
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="flex-1 overflow-hidden p-1">
            <ChatBox />
          </div>
        </div>
      </div>

      {/* ── Theme Toggle ── */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 lg:top-6 lg:right-6 z-50 w-9 h-9 flex items-center justify-center border border-slate-700 bg-slate-900/90 backdrop-blur-sm text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-all duration-200 rounded-sm"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        )}
      </button>

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
              className={`group flex flex-col overflow-hidden border ${ac.border} rounded-sm bg-slate-900/40 hover:bg-slate-900/70 transition-all duration-300`}
            >
              {/* Preview thumbnail — clicking opens the cert */}
              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-44 overflow-hidden bg-white block"
              >
                <PDFPreview
                  url={cert.file}
                  className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className={`absolute top-2 right-2 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${ac.bg} ${ac.text} border ${ac.border}`}>
                  pdf
                </div>
              </a>
              {/* Metadata strip — matches image card layout */}
              <div className="p-3 flex-1 flex flex-col gap-1">
                <div className="text-xs font-mono font-semibold text-slate-100 leading-snug">
                  {cert.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {cert.issuer}
                </div>
                {cert.date && (
                  <div className={`text-[10px] font-mono mt-auto pt-2 ${ac.text}`}>
                    {cert.date}
                  </div>
                )}
              </div>
              {/* Action bar */}
              <div className="flex gap-2 px-3 pb-3">
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
      description: "On providing exceptional customer services to the clients",
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

        {/* ── Availability badge ── */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Open to PhD positions &amp; consulting engagements
          </span>
        </div>

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

// ─── DIAGRAM PRIMITIVES (used by EnterpriseHealthcarePlatform) ───────────────

function ArchNode({
  title,
  desc,
  className = "",
}: {
  title: string;
  desc?: string;
  className?: string;
}) {
  return (
    <div
      className={`border border-slate-700 bg-slate-900/80 p-2 rounded-sm ${className}`}
    >
      <div className="text-[10px] font-mono font-semibold text-slate-200 leading-tight">
        {title}
      </div>
      {desc && (
        <div className="text-[9px] font-mono text-slate-500 mt-0.5 leading-snug">
          {desc}
        </div>
      )}
    </div>
  );
}

function FlowArrowV() {
  return (
    <div className="flex justify-center text-slate-600 text-sm leading-none py-0.5 select-none">
      ↓
    </div>
  );
}

function FlowArrowH() {
  return (
    <div className="text-slate-600 text-sm self-center shrink-0 select-none px-0.5">
      →
    </div>
  );
}

// ─── ENTERPRISE HEALTHCARE PLATFORM ─────────────────────────────────────────

function EnterpriseHealthcarePlatform() {
  const techStack = [
    "Next.js 15",
    "React 19",
    "TypeScript 5",
    "SASS",
    "Kontent.ai",
    "Algolia",
    "NextAuth",
    "Azure AD",
    "FHIR / eSante",
    "Docker",
    "AWS",
    "Framer Motion",
  ];

  const contributions = [
    "Architected a collection-based multi-tenant system where one Docker image serves 20+ regional markets — behavior driven entirely by environment variables, with no per-region code forks or separate deployments.",
    "Built a generic CMS rendering pipeline (ContentZone + 28 block types, variant pattern) enabling marketing to ship entirely new pages without any frontend code changes or deployments.",
    "Implemented FHIR-standard healthcare practitioner verification (RPPS-ID) against France's national eSante registry — cross-validating name, identifier, and PractitionerRole for medical compliance.",
    "Eliminated type drift across 40+ CMS content types by code-generating 140+ TypeScript interfaces from the live schema using @kontent-ai/model-generator; renaming a CMS field immediately surfaces as a compile error.",
    "Engineered ISR with per-content-type revalidation windows and a custom image loader (WebP, lossless, 6 responsive srcset sizes) delivering CDN-scale performance across 20+ locales with zero client-side image JS.",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2 py-1 text-[9px] font-mono bg-slate-900 border border-slate-700 text-slate-500 rounded-sm mb-3 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
          NDA · Fortune 500 Global Medical Device Company · Proprietary identifiers omitted
        </div>
        <h1 className="text-3xl font-serif text-slate-100 mb-3">
          Enterprise Healthcare Web Platform
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-cyan-500 pl-4">
          Production platform serving 20+ regional markets and millions of
          monthly visitors — headless CMS-driven marketing site, authenticated
          healthcare professional portals, multi-region careers system, and 3D
          medical product visualization, all from a single Next.js 15 codebase.
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
            className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-[10px] font-mono rounded-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Regional Markets",
            value: "20+",
            color: "text-cyan-400",
            border: "border-cyan-500/40",
          },
          {
            label: "TS Types (auto-gen)",
            value: "140+",
            color: "text-purple-400",
            border: "border-purple-500/40",
          },
          {
            label: "UI Components",
            value: "82+",
            color: "text-emerald-400",
            border: "border-emerald-500/40",
          },
          {
            label: "3rd-Party Integrations",
            value: "10+",
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

      {/* ── DIAGRAM 1: System Architecture ── */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
          Fig. 1 — System Architecture
        </div>

        {/* Layer 1: Content Authoring */}
        <div className="border border-cyan-500/30 bg-cyan-950/10 rounded-sm p-3">
          <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest mb-2">
            Content Authoring Layer
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ArchNode
              title="Kontent.ai CMS"
              desc="40+ content types · 6 collections · multi-locale"
            />
            <ArchNode
              title="Job Posting Backend"
              desc="AWS DynamoDB · Custom REST API"
            />
          </div>
        </div>

        <FlowArrowV />

        {/* Layer 2: Next.js */}
        <div className="border border-blue-500/30 bg-blue-950/10 rounded-sm p-3">
          <div className="text-[9px] font-mono text-blue-400 uppercase tracking-widest mb-2">
            Next.js 15 App Layer
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <ArchNode
              title="Server Components"
              desc="SSG + ISR · generateStaticParams"
            />
            <ArchNode
              title="API Routes"
              desc="/api/auth · /api/draft · /api/health"
            />
            <ArchNode
              title="Middleware"
              desc="i18n routing · locale injection"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ArchNode
              title="Client Components"
              desc="Search · Forms · Auth · IDG wizard"
            />
            <ArchNode
              title="28 Content Blocks"
              desc="CMS-driven · variant pattern"
            />
            <ArchNode title="82+ UI Primitives" desc="Button · Image · Modal · Video" />
          </div>
        </div>

        <FlowArrowV />

        {/* Layer 3: Third-Party */}
        <div className="border border-purple-500/30 bg-purple-950/10 rounded-sm p-3">
          <div className="text-[9px] font-mono text-purple-400 uppercase tracking-widest mb-2">
            Third-Party Service Layer
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <ArchNode title="Algolia" desc="14 locale indices · faceted search" />
            <ArchNode title="Azure AD" desc="Multi-tenant OIDC/OAuth2 SSO" />
            <ArchNode title="eSante FHIR" desc="Practitioner verification" />
            <ArchNode title="reCAPTCHA v3" desc="Bot protection on forms" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <ArchNode title="Marketo" desc="Lead capture & automation" />
            <ArchNode title="SketchFab" desc="3D product viewer" />
            <ArchNode title="Docebo LMS" desc="Learning portal" />
            <ArchNode title="GTM + PDF API" desc="Analytics · Document gen" />
          </div>
        </div>

        <figcaption className="text-xs font-mono text-slate-500 mt-4 border-t border-slate-800 pt-2">
          Three-tier headless architecture: content authoring → Next.js 15 app
          layer → third-party services
        </figcaption>
      </figure>

      {/* ── DIAGRAM 2: Authentication Architecture ── */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
          Fig. 2 — Authentication Architecture
        </div>

        {/* Entry chain */}
        <div className="flex items-stretch gap-1 mb-1">
          <ArchNode title="User" className="flex-1 text-center" />
          <FlowArrowH />
          <ArchNode
            title="Protected Route"
            desc="pattern-matched paths"
            className="flex-1 text-center"
          />
          <FlowArrowH />
          <ArchNode
            title="use-auth Hook"
            desc="session check"
            className="flex-1 text-center"
          />
        </div>

        <FlowArrowV />

        {/* Decision */}
        <div className="border border-slate-600 bg-slate-900/60 rounded-sm py-2 px-4 text-center mx-auto max-w-50 mb-1">
          <div className="text-[10px] font-mono font-semibold text-slate-300">
            Authenticated?
          </div>
        </div>

        {/* Two branches */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* YES branch */}
          <div className="space-y-1 border-r border-slate-800 pr-3">
            <div className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest text-center">
              ✓ Session valid
            </div>
            <FlowArrowV />
            <ArchNode
              title="Render Protected Content"
              className="text-center border-emerald-500/40 bg-emerald-950/10"
            />
          </div>

          {/* NO branch */}
          <div className="space-y-1 pl-0">
            <div className="text-[9px] font-mono text-red-500 uppercase tracking-widest text-center">
              ✗ No session
            </div>
            <FlowArrowV />
            <ArchNode
              title="Redirect to Login"
              desc="?callbackUrl=original"
              className="text-center"
            />
            <FlowArrowV />
            <div className="grid grid-cols-2 gap-1">
              <ArchNode
                title="Azure AD"
                desc="OIDC · AU & FR tenants"
                className="text-center border-blue-500/40 bg-blue-950/10"
              />
              <ArchNode
                title="RPPS-ID"
                desc="FHIR · eSante · France"
                className="text-center border-purple-500/40 bg-purple-950/10"
              />
            </div>
            <FlowArrowV />
            <ArchNode
              title="NextAuth Callback"
              desc="Tenant validation · Session creation"
              className="text-center border-cyan-500/40 bg-cyan-950/10"
            />
            <FlowArrowV />
            <ArchNode
              title="Redirect to Original Destination"
              className="text-center border-emerald-500/40 bg-emerald-950/10"
            />
          </div>
        </div>

        <figcaption className="text-xs font-mono text-slate-500 mt-4 border-t border-slate-800 pt-2">
          Multi-provider auth: Azure AD (enterprise OIDC) + RPPS-ID FHIR
          verification against France's national eSante practitioner registry
        </figcaption>
      </figure>

      {/* ── DIAGRAM 3: CMS Block Rendering Pipeline ── */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
          Fig. 3 — CMS Block Rendering Pipeline
        </div>

        {/* Stage 1 */}
        <div className="flex items-stretch gap-1 mb-1">
          <ArchNode
            title="Kontent.ai CMS"
            desc="Published / Draft content"
            className="flex-1 text-center border-amber-500/40 bg-amber-950/10"
          />
          <FlowArrowH />
          <ArchNode
            title="Delivery API"
            desc="or Preview API (draft mode)"
            className="flex-1 text-center"
          />
          <FlowArrowH />
          <ArchNode
            title="lib/queries/"
            desc="42+ typed fetch functions"
            className="flex-1 text-center border-blue-500/40 bg-blue-950/10"
          />
        </div>

        <FlowArrowV />

        {/* Stage 2 */}
        <div className="flex items-stretch gap-1 mb-1">
          <ArchNode
            title="Page Server Component"
            desc="app/[locale]/[...slug]/page.tsx"
            className="flex-1 text-center border-blue-500/40 bg-blue-950/10"
          />
          <FlowArrowH />
          <ArchNode
            title="&lt;ContentZone /&gt;"
            desc="Block type → Component lookup"
            className="flex-1 text-center border-cyan-500/40 bg-cyan-950/10"
          />
        </div>

        <FlowArrowV />

        {/* Stage 3: Block dispatch */}
        <div className="border border-slate-700 bg-slate-900/40 rounded-sm p-3 mb-1">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">
            Block Variant Dispatch — 28 types
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: "hero_1a", color: "border-slate-600" },
              { label: "form_2b", color: "border-slate-600" },
              { label: "accordion_1a", color: "border-slate-600" },
              { label: "job-search", color: "border-slate-600" },
            ].map(({ label, color }) => (
              <div
                key={label}
                className={`border ${color} bg-slate-900 px-2 py-1.5 rounded-sm text-center`}
              >
                <span className="text-[9px] font-mono text-slate-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <FlowArrowV />

        {/* Stage 4: Primitives */}
        <div className="border border-emerald-500/30 bg-emerald-950/10 rounded-sm p-3">
          <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mb-2">
            UI Primitives — 82+ components
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Button",
              "ResponsiveImage",
              "VideoPlayer",
              "Modal",
              "RichText",
              "Dropdown",
              "Swiper",
              "AuthButton",
            ].map((p) => (
              <span
                key={p}
                className="border border-slate-700 bg-slate-900 px-2 py-0.5 rounded-sm text-[9px] font-mono text-slate-400"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <figcaption className="text-xs font-mono text-slate-500 mt-4 border-t border-slate-800 pt-2">
          Marketing builds new pages entirely in the CMS — ContentZone resolves
          block types to React variants at render time with zero code deployments
        </figcaption>
      </figure>

      {/* Key Contributions */}
      <div className="border border-slate-800 bg-slate-900/20 p-5 rounded-sm">
        <h2 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-4">
          Key Contributions
        </h2>
        <ul className="space-y-3">
          {contributions.map((c, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-slate-400 leading-relaxed"
            >
              <span className="text-cyan-600 font-mono shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible engineering decisions */}
      <details className="group border border-slate-800 rounded-sm">
        <summary className="px-4 py-3 text-xs font-mono text-slate-500 cursor-pointer hover:text-slate-300 transition-colors list-none flex justify-between items-center">
          <span>Engineering Decisions &amp; Design Strengths</span>
          <span className="group-open:rotate-90 transition-transform duration-200">
            ›
          </span>
        </summary>
        <div className="px-4 pb-5 pt-3 border-t border-slate-800 space-y-4 text-sm text-slate-400 leading-relaxed">
          {[
            {
              title: "Collection-based Multi-tenancy",
              body: "A single Docker image serves 20+ regional sites by parameterising behavior through KONTENT_COLLECTION and LOCALES environment variables. Redirects and rewrites load from namespaced JSON files at build time — no forks, no per-region deployments, one codebase to maintain.",
            },
            {
              title: "Code-Generated Type Safety",
              body: "Running @kontent-ai/model-generator against the live CMS API produces 140+ TypeScript interfaces always in sync with the content schema. Renaming a CMS field immediately surfaces as a compile error across 42+ query functions and 28 block components — zero manual type maintenance.",
            },
            {
              title: "FHIR Healthcare Identity Verification",
              body: "The RPPS-ID auth flow queries France's national eSante FHIR registry, validates the practitioner identifier, cross-references given name and family name against the Practitioner and PractitionerRole resources, then creates a NextAuth session only on full match — a compliance-grade auth path unique to medical platforms.",
            },
            {
              title: "ISR + Custom Image Pipeline",
              body: "Revalidation windows are tuned per content type: 5 min for careers, 10 min for press releases, 2 hr for search-indexed content. A custom image loader appends WebP conversion, lossless compression, and 6 responsive srcset sizes to every Kontent.ai CDN asset URL at request time.",
            },
            {
              title: "Security-Hardened Docker Builds",
              body: "Multi-stage builds on Amazon Linux 2023 remove .npmrc (containing the FontAwesome Pro private registry token) after install, copy only standalone build artifacts to the final image, and run as a non-root user (UID 1001) — no source code or dev dependencies in the production container.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-xs font-mono text-cyan-400 mb-1">{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

// ─── CAREERS JOB PIPELINE & REST API ─────────────────────────────────────────

function CareersLambdas() {
  const techStack = [
    "Node.js 20",
    "AWS Lambda",
    "DynamoDB",
    "API Gateway",
    "EventBridge",
    "Serverless Framework v3",
    "Algolia",
    "Workday XML API",
    "OAuth 2.0",
    "xml-js",
    "CloudFront",
  ];

  const contributions = [
    "Built a fully serverless, event-driven job-sync pipeline that eliminates a traditional HR backend — Workday XML feeds are automatically ingested, transformed, and committed to DynamoDB + Algolia every two hours without any persistent infrastructure.",
    "Designed a change-detection gate before all write operations: the pipeline scans existing DynamoDB IDs, compares them against the incoming Workday feed by count and set membership, and skips every write when data is unchanged — preventing unnecessary costs and the brief Algolia stale-result window during re-indexing.",
    "Implemented OAuth 2.0 refresh-token flow against Workday's token endpoint on every invocation, handling base64 client credentials and bearer token injection into the downstream XML report API call.",
    "Engineered a dual-format transformation in a single loop: mapJobPart() accepts a purpose flag ('DB' or 'search') and produces DynamoDB typed JSON or plain Algolia-ready JSON without a second pass or intermediate copies.",
    "Set reserved concurrency to 1 on the 15-minute import function to prevent EventBridge's next scheduled firing from overlapping a slow run — avoiding duplicate DynamoDB deletes and conflicting Algolia writes.",
    "Deployed the fetch endpoint as an EDGE-type API Gateway backed by CloudFront, distributing job-record reads globally without requiring a separate CDN setup.",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2 py-1 text-[9px] font-mono bg-slate-900 border border-slate-700 text-slate-500 rounded-sm mb-3 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          AWS · Serverless · Production Pipeline
        </div>
        <h1 className="text-3xl font-serif text-slate-100 mb-3">
          Careers Job Pipeline &amp; REST API
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-amber-500 pl-4">
          Fully serverless data pipeline and REST API on AWS Lambda that
          automatically syncs job listings from a Workday HR system into
          DynamoDB and Algolia Search on a two-hour cron schedule, and exposes
          individual job records through an edge-cached, API-key-secured
          endpoint.
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
            className="px-2 py-0.5 bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[10px] font-mono rounded-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Lambda Functions", value: "2", color: "text-amber-400", border: "border-amber-500/40" },
          { label: "Sync Interval", value: "2 hr", color: "text-blue-400", border: "border-blue-500/40" },
          { label: "Algolia Facets", value: "5", color: "text-purple-400", border: "border-purple-500/40" },
          { label: "DynamoDB Batch Size", value: "25", color: "text-emerald-400", border: "border-emerald-500/40" },
        ].map((s) => (
          <div
            key={s.label}
            className={`border ${s.border} bg-slate-900/40 p-3 rounded-sm text-center`}
          >
            <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── DIAGRAM 1: Cloud Architecture ── */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
          Fig. 1 — AWS Cloud Architecture
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Write path */}
          <div className="border border-amber-500/30 bg-amber-950/10 rounded-sm p-3 space-y-1">
            <div className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mb-2">
              Write Path — Scheduled
            </div>
            <ArchNode
              title="EventBridge Cron"
              desc="cron(12 */2 ? * * *) · fires every 2 hours"
              className="border-amber-500/40 bg-amber-950/10 text-center"
            />
            <FlowArrowV />
            <ArchNode
              title="Lambda: importJob"
              desc="Node 20 · 2048 MB · 900 s · Concurrency: 1"
              className="border-amber-500/40"
            />
            <FlowArrowV />
            <ArchNode
              title="Workday OAuth2 + XML Report API"
              desc="Refresh token → access token → XML feed fetch"
            />
            <FlowArrowV />
            <ArchNode
              title="Transform + Change Detection"
              desc="mapJobPart() dual-format · count + set comparison"
            />
            <FlowArrowV />
            <div className="grid grid-cols-2 gap-1">
              <ArchNode
                title="Algolia Index"
                desc="clearObjects + saveObjects · 5 facets"
                className="border-purple-500/40 bg-purple-950/10"
              />
              <ArchNode
                title="DynamoDB"
                desc="delete-all → batchWrite 25/chunk"
                className="border-amber-500/40 bg-amber-950/10"
              />
            </div>
          </div>

          {/* Read path */}
          <div className="border border-blue-500/30 bg-blue-950/10 rounded-sm p-3 space-y-1">
            <div className="text-[9px] font-mono text-blue-400 uppercase tracking-widest mb-2">
              Read Path — On-Demand API
            </div>
            <ArchNode
              title="Portfolio Website (client)"
              desc="GET /api/fetchjobdetails/{id}"
              className="border-blue-500/40 bg-blue-950/10 text-center"
            />
            <FlowArrowV />
            <ArchNode
              title="API Gateway — REST, Edge"
              desc="x-api-key header auth · CloudFront global CDN"
              className="border-blue-500/40"
            />
            <FlowArrowV />
            <ArchNode
              title="Lambda: fetchJob"
              desc="Node 20 · 2048 MB · 29 s · Concurrency: 100"
              className="border-blue-500/40"
            />
            <FlowArrowV />
            <ArchNode
              title="DynamoDB getItem"
              desc="PK: id (requisition ID) · point lookup"
              className="border-emerald-500/40 bg-emerald-950/10"
            />
            <FlowArrowV />
            <div className="grid grid-cols-2 gap-1">
              <ArchNode
                title="HTTP 200"
                desc="Job record JSON"
                className="border-emerald-500/40 bg-emerald-950/10 text-center"
              />
              <ArchNode
                title="HTTP 404"
                desc="Item not found"
                className="border-rose-500/40 bg-rose-950/10 text-center"
              />
            </div>
          </div>
        </div>

        <figcaption className="text-xs font-mono text-slate-500 mt-4 border-t border-slate-800 pt-2">
          Two independent Lambda functions share one DynamoDB table — importJob
          writes on a cron schedule; fetchJob reads on demand through an
          edge-cached API Gateway
        </figcaption>
      </figure>

      {/* ── DIAGRAM 2: importJob Pipeline (6-step sequence) ── */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
          Fig. 2 — importJob Data Pipeline (6-step sequence)
        </div>

        <ArchNode
          title="EventBridge fires cron trigger"
          className="text-center border-amber-500/40 bg-amber-950/10"
        />
        <FlowArrowV />

        {/* Steps 1 & 2 */}
        <div className="grid grid-cols-2 gap-2 mb-1">
          <div className="border border-slate-700 bg-slate-900/50 rounded-sm p-2 space-y-1">
            <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">
              Step 1 — OAuth2
            </div>
            <ArchNode
              title="POST token endpoint"
              desc="Authorization: Basic base64(id:secret)"
            />
            <FlowArrowV />
            <ArchNode
              title="{ access_token }"
              desc="Bearer token for report API"
              className="border-emerald-500/40 bg-emerald-950/10"
            />
          </div>
          <div className="border border-slate-700 bg-slate-900/50 rounded-sm p-2 space-y-1">
            <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">
              Step 2 — Fetch
            </div>
            <ArchNode
              title="GET Workday XML Report"
              desc="Authorization: Bearer {access_token}"
            />
            <FlowArrowV />
            <ArchNode
              title="XML Payload"
              desc="wd:Report_Data · one wd:Report_Entry per job"
              className="border-amber-500/40 bg-amber-950/10"
            />
          </div>
        </div>

        <FlowArrowV />

        {/* Steps 3 & 4 */}
        <div className="grid grid-cols-2 gap-2 mb-1">
          <div className="border border-slate-700 bg-slate-900/50 rounded-sm p-2 space-y-1">
            <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">
              Step 3 — Parse
            </div>
            <ArchNode
              title="DOMParser + xml-js"
              desc="Extract each wd:Report_Entry node"
            />
            <FlowArrowV />
            <ArchNode
              title="Raw JSON array"
              desc="One object per job posting"
              className="border-slate-600 bg-slate-900"
            />
          </div>
          <div className="border border-slate-700 bg-slate-900/50 rounded-sm p-2 space-y-1">
            <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">
              Step 4 — Transform
            </div>
            <ArchNode
              title="mapJobPart(job, purpose)"
              desc="Single loop · dual-format output"
            />
            <FlowArrowV />
            <ArchNode
              title="dbJobs[ ]"
              desc="DynamoDB typed JSON (S / N wrappers)"
              className="border-amber-500/40 bg-amber-950/10"
            />
            <ArchNode
              title="searchJobs[ ]"
              desc="Plain JSON · objectID + Remote + startDate"
              className="border-purple-500/40 bg-purple-950/10"
            />
          </div>
        </div>

        <FlowArrowV />

        {/* Step 5: Change detection */}
        <div className="border border-slate-600 bg-slate-900/60 rounded-sm py-2 px-4 text-center mb-1">
          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">
            Step 5 — Change Detection
          </div>
          <div className="text-[10px] font-mono font-semibold text-slate-300">
            Scan DynamoDB IDs → compare count + set membership
          </div>
        </div>

        {/* Branch: no-change vs data-changed */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="space-y-1 border-r border-slate-800 pr-3">
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center">
              ✗ No change
            </div>
            <FlowArrowV />
            <ArchNode
              title="EXIT — no-op"
              desc="All writes skipped · zero DynamoDB + Algolia cost"
              className="text-center border-slate-600 bg-slate-900"
            />
          </div>
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest text-center">
              ✓ Data changed
            </div>
            <FlowArrowV />
            <div className="border border-slate-700 bg-slate-900/50 rounded-sm p-2 space-y-1">
              <div className="text-[9px] font-mono text-amber-500 uppercase tracking-widest mb-1">
                Step 6 — Sync
              </div>
              <ArchNode
                title="6a · Algolia clearObjects + saveObjects"
                desc="Facets: Country · Category · EmployeeType · Remote · Location"
                className="border-purple-500/40 bg-purple-950/10"
              />
              <FlowArrowV />
              <ArchNode
                title="6b · DynamoDB deleteItem (all existing)"
                desc="Clear stale records before writing fresh batch"
                className="border-rose-500/40 bg-rose-950/10"
              />
              <FlowArrowV />
              <ArchNode
                title="6c · batchWriteItem (25 items / chunk)"
                desc="Sequential batch writes · DynamoDB API limit"
                className="border-amber-500/40 bg-amber-950/10"
              />
            </div>
          </div>
        </div>

        <figcaption className="text-xs font-mono text-slate-500 mt-4 border-t border-slate-800 pt-2">
          Change-detection gate at Step 5 short-circuits all downstream writes
          when the Workday feed is identical to the current DB state
        </figcaption>
      </figure>

      {/* Key Contributions */}
      <div className="border border-slate-800 bg-slate-900/20 p-5 rounded-sm">
        <h2 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-4">
          Key Contributions
        </h2>
        <ul className="space-y-3">
          {contributions.map((c, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-slate-400 leading-relaxed"
            >
              <span className="text-amber-600 font-mono shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible engineering decisions */}
      <details className="group border border-slate-800 rounded-sm">
        <summary className="px-4 py-3 text-xs font-mono text-slate-500 cursor-pointer hover:text-slate-300 transition-colors list-none flex justify-between items-center">
          <span>Engineering Decisions &amp; Design Strengths</span>
          <span className="group-open:rotate-90 transition-transform duration-200">›</span>
        </summary>
        <div className="px-4 pb-5 pt-3 border-t border-slate-800 space-y-4 text-sm text-slate-400 leading-relaxed">
          {[
            {
              title: "Change Detection Before Writing",
              body: "Each run scans all existing DynamoDB IDs and compares them against the incoming Workday feed by count and set membership. If identical, every write — DynamoDB deletes, batch inserts, and the Algolia re-index — is skipped entirely. This eliminates unnecessary write costs and prevents Algolia from briefly serving stale results during its clear+write window.",
            },
            {
              title: "Reserved Concurrency: 1",
              body: "The importJob function runs for up to 15 minutes. Capping concurrency to 1 prevents EventBridge's next scheduled invocation from spawning a parallel run while the previous one is still in progress — which would produce duplicate DynamoDB deletes and conflicting Algolia index operations.",
            },
            {
              title: "Dual-Format Transform in One Pass",
              body: "mapJobPart() accepts a 'purpose' argument ('DB' or 'search') and returns the appropriate data shape in a single loop over the Workday feed. Both the DynamoDB typed array and the Algolia plain-JSON array are built simultaneously — no second pass, no intermediate copies, no risk of the two representations diverging.",
            },
            {
              title: "DynamoDB Batch Write Chunking",
              body: "batchWriteItem accepts a maximum of 25 items per API call. The createBatches utility pre-splits the job array into 25-item chunks and the pipeline writes them sequentially, ensuring it stays within DynamoDB's API limits regardless of how many jobs Workday returns.",
            },
            {
              title: "Edge API Gateway Endpoint",
              body: "The fetchJob API is deployed as an EDGE-type endpoint distributed through CloudFront's global network, reducing read latency for geographically distributed portfolio visitors without a separate CDN configuration or additional infrastructure cost.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <div className="text-xs font-mono text-amber-400 mb-1">{title}</div>
              <p className="text-slate-500 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

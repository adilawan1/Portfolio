"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox"; // Your existing chat component
import Image from "next/image";

export default function PortfolioDashboard() {
  const [activeProject, setActiveProject] = useState("profile");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    // Changed md:flex-row to lg:flex-row
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 lg:p-8 flex flex-col lg:flex-row gap-6 relative overflow-x-hidden">
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
        </header>

        {/* Dynamic Project Content Area */}
        <main className="flex-1 bg-slate-900/50 border border-slate-800 p-4 lg:p-8 rounded-sm overflow-y-auto">
          {activeProject === "profile" && <ProfileResume />}
          {activeProject === "nasa-telemetry" && <NasaTelemetryProject />}
          {activeProject === "ros2-barn" && <ROS2Project />}
        </main>
      </div>

      {/* RIGHT PANEL: Desktop Persistent AI Co-Pilot */}
      {/* Changed hidden md:flex to hidden lg:flex to prevent the side panel from rendering too early */}
      <aside className="hidden lg:flex w-full lg:w-[380px] xl:w-[450px] flex-col h-[85vh] sticky top-8">
        <div className="border border-slate-800 bg-slate-900/30 p-3 mb-2 flex justify-between items-center text-xs font-mono">
          <span className="text-blue-500 animate-pulse">● SYSTEM ONLINE</span>
          <span className="text-slate-500">VECTOR_DIM: 768</span>
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
              <span className="text-slate-300">CO-PILOT.AGENT</span>
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
        INIT_CHAT
      </button>
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
        MS Artificial Intelligence Project (Deep Learning)
        <br />
        <br /> Tech Stack: Python, TensorFlow, PyTorch, CUDA, NumPy, Pandas,
        Scikit-Learn, Matplotlib, Google Colab, Kaggle CLI, LaTeX
      </div>
      {/* Your existing figure container */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden border border-slate-800">
          <Image
            src="/anomaly-detection-architecture.png"
            alt="Autoencoder Architecture Diagram"
            fill
            className="object-contain filter contrast-125 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>
        <figcaption className="text-xs font-mono text-slate-500 mt-3 border-t border-slate-800 pt-2">
          Fig - Architecture variance.
        </figcaption>
      </figure>
      <p className="leading-relaxed text-slate-400">
        <strong>Abstract:</strong> Industrial and spacecraft telemetry streams
        gen erate vast volumes of multivariate sensor data, but labelled
        anomalies are rare or absent. We study purely unsupervised
        reconstruction-based detection on the NASA SMAP/MSL telemetry benchmark
        and propose a hybrid temporal au toencoder that runs an LSTM and a
        Temporal Convolutional Network (TCN) encoder in paral lel, fuses their
        per-timestep representations with a learned attention gate, and scores
        anomalies by combining input-space reconstruction error with a
        latent-space Mahalanobis distance (dual scor ing). We further introduce
        an anomaly-masked dynamic threshold that prevents sustained anoma lies
        from inflating the running baseline. Across six representative SMAP and
        MSL channels, the dual score yields perfect recall on every model
        evaluated and lifts the seq-to-seq LSTM autoen coder to a mean
        Point-Adjusted F1 of 0.953, sub stantially above the CNN baseline
        (0.775). The hybrid model reaches 0.846 and is the most con sistent
        recall-1.0 detector, showing that fusing reconstruction error with
        latent distance catches anomalies that either signal misses alone.
      </p>

      {/* PDF ATTACHMENT ACTION BAR */}
      <div className="flex flex-wrap gap-4 p-4 border border-slate-800 bg-slate-950/60 rounded-sm items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">📄</span>
          <div>
            <div className="text-xs font-mono text-slate-300">
              NASA_Telemetry_Report.pdf
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Size: 2.4 MB | Format: IEEE Manuscript
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Opens PDF in a new browser tab */}
          <a
            href="/anomaly-detection-report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 font-mono text-xs border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
          >
            [VIEW_MANUSCRIPT]
          </a>
          {/* Forces a direct file download */}
          <a
            href="/anomaly-detection-report.pdf"
            download
            className="px-3 py-1.5 font-mono text-xs bg-blue-900/20 border border-blue-800 text-blue-400 hover:bg-blue-900/40 transition-colors"
          >
            [DOWNLOAD_RAW]
          </a>
        </div>
      </div>
    </div>
  );
}

function ROS2Project() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-slate-100">
        Camera-LiDAR Based Autonomous Navigation in BARN using ROS2
      </h1>
      <div className="text-sm font-mono text-blue-400 border-l-2 border-blue-500 pl-4 py-1">
        MS Artificial Intelligence Project (Robotics) <br />
        <br />
        Tech Stack: Python, ROS 2, OpenCV, NumPy, cv_bridge, rclpy
      </div>
      {/* Your existing figure container */}
      <figure className="border border-slate-700 bg-slate-950 p-4 rounded-sm">
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden border border-slate-800">
          <Image
            src="/VFH.png"
            alt="Autoencoder Architecture Diagram"
            fill
            className="object-contain filter contrast-125 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>
        <figcaption className="text-xs font-mono text-slate-500 mt-3 border-t border-slate-800 pt-2">
          Fig - Vector Field Histogram Diagram.
        </figcaption>
      </figure>
      <p className="leading-relaxed text-slate-400">
        <strong>Abstract:</strong> This paper presents a ROS 2–based au tonomous
        navigation system for the Benchmark Au tonomous Robot Navigation (BARN)
        environment, com bining vision and LiDAR sensing for robust navigation
        in cluttered spaces. Our vision-based masking pipeline segments
        obstacles and extracts traversable floor re gions from RGB images, using
        a centroid-based pro portional controller to guide the robot.
        Simultaneously, LiDAR data is processed via a Vector Field Histogram
        (VFH)–inspired approach. This method constructs an inverse-distance
        weighted polar histogram to identify contiguous free-space regions,
        selecting the midpoint of the widest feasible valley as the optimal
        path. The final steering command is a weighted fusion of these dual
        perception streams, ensuring robustness under varying environmental
        conditions. To overcome local minima, we incorporate SLAM for global
        mapping and an exploration-driven scoring function for effective
        recovery. The system achieves an average score of 0.324 on the BARN
        benchmark and successfully navigates 41 out of 50 worlds (250-299) of
        the test worlds, demonstrating significant effectiveness in handling
        narrow passages and occlusions.
      </p>

      {/* PDF ATTACHMENT ACTION BAR */}
      <div className="flex flex-wrap gap-4 p-4 border border-slate-800 bg-slate-950/60 rounded-sm items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">📄</span>
          <div>
            <div className="text-xs font-mono text-slate-300">
              ros2_BARN_Report.pdf
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Size: 2.4 MB | Format: IEEE Manuscript
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Opens PDF in a new browser tab */}
          <a
            href="/barn-challenge.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 font-mono text-xs border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
          >
            [VIEW_MANUSCRIPT]
          </a>
          {/* Forces a direct file download */}
          <a
            href="/barn-challenge.pdf"
            download
            className="px-3 py-1.5 font-mono text-xs bg-blue-900/20 border border-blue-800 text-blue-400 hover:bg-blue-900/40 transition-colors"
          >
            [DOWNLOAD_RAW]
          </a>
        </div>
      </div>
    </div>
  );
}

// --- INTERACTIVE RESUME ---

function ProfileResume() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Profile Section */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-serif text-slate-100 mb-2">Ahmed Adil</h1>
        <div className="text-sm font-mono text-purple-400 border-l-2 border-purple-500 pl-4 py-1">
          Senior Software Engineer & AI Researcher
        </div>
        <p className="mt-4 text-slate-400 leading-relaxed">
          Bridging the gap between multi-tenant enterprise architecture and
          advanced artificial intelligence research. Currently focusing on Deep
          Learning, RAG infrastructures, and autonomous robotics with the intent
          to make an impact.
        </p>
      </div>

      {/* Grid for Academic and Professional split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education Block */}
        <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-500">🎓</span>
            <h2 className="text-lg font-semibold text-slate-200">
              Academic Research
            </h2>
          </div>
          <div className="space-y-3 font-mono text-sm">
            <div>
              <div className="text-slate-300">MS Artificial Intelligence</div>
              <div className="text-slate-500 text-xs">LUMS • Final Year</div>
            </div>
            <div>
              <div className="text-slate-300">Current CGPA</div>
              <div className="text-blue-400">3.76 / 4.0</div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <div className="text-slate-500 text-xs mb-1">Focus Areas:</div>
              <div className="text-slate-400">
                Neural Networks (RNN/LSTM), Transformers, Computer Vision,
                Autonomous Navigation.
              </div>
            </div>
          </div>
        </div>

        {/* Experience Block */}
        <div className="border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-500">💻</span>
            <h2 className="text-lg font-semibold text-slate-200">
              Engineering Foundation
            </h2>
          </div>
          <div className="space-y-3 font-mono text-sm">
            <div>
              <div className="text-slate-300">Senior Software Engineer</div>
              <div className="text-slate-500 text-xs">
                Xavor Corporation • ~4 Years
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <div className="text-slate-500 text-xs mb-1">
                Core Tech Stack:
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "React",
                  "Next.js",
                  "LangChain",
                  "Kentico Headless CMS",
                  "ROS 2",
                  "PyTorch",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded-sm border border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-slate-400 text-xs leading-relaxed mt-2">
              Architected and maintained multi-tenant enterprise systems
              supporting up to 20 distinct tenants. Integrated complex Auth0
              identity providers across .NET and React Native ecosystems.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

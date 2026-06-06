"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox"; // Your existing chat component
import Image from "next/image";

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
            onClick={() => setActiveProject("ros2-barn")}
            className={`px-4 py-2 font-mono text-sm border ${activeProject === "ros2-barn" ? "border-emerald-500 text-emerald-400 bg-emerald-900/20" : "border-slate-800 hover:border-slate-600"}`}
          >
            [2] BARN Challenge ROS 2
          </button>
        </header>

        {/* Dynamic Project Content Area */}
        <main className="flex-1 bg-slate-900/50 border border-slate-800 p-8 rounded-sm overflow-y-auto">
          {activeProject === "nasa-telemetry" && <NasaTelemetryProject />}
          {activeProject === "ros2-barn" && <ROS2Project />}
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

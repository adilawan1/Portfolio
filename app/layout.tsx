import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmed Adil — Senior Software Engineer & AI Researcher",
  description:
    "Portfolio of Ahmed Adil: 4 years of enterprise software engineering at Xavor Corporation, MS AI at LUMS (3.76 GPA), research in anomaly detection and autonomous navigation. Features an AI assistant trained on his resume.",
  openGraph: {
    title: "Ahmed Adil — Senior Software Engineer & AI Researcher",
    description:
      "Enterprise SaaS · Deep Learning · Autonomous Robotics · RAG Systems. Ask my AI assistant anything about my work.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ahmed Adil — Senior Software Engineer & AI Researcher",
    description:
      "Enterprise SaaS · Deep Learning · Autonomous Robotics. Portfolio with an AI assistant trained on my resume.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

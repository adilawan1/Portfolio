import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-slate-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            Ahmed Adil
          </h1>
          <p className="text-xl text-blue-400 font-medium">
            Software Engineer & AI Researcher
          </p>
        </div>
      </div>

      <ChatBox />
    </main>
  );
}

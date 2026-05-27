export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Ahmed Adil</h1>
        <p className="text-xl text-slate-400">
          Software Engineer & AI Researcher
        </p>
      </div>

      {/* We will inject the 3D or Chat component here later */}
      <div className="flex-1 flex items-center justify-center w-full mt-12 border-2 border-dashed border-slate-700 rounded-xl p-8">
        <p className="text-slate-500 text-lg">
          [ Interactive AI Clone Placeholder ]
        </p>
      </div>
    </main>
  );
}

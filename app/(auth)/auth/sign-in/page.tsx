import SignInFormClient from '@/modules/auth/components/sign-in-form-client'
import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] relative">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 w-full max-w-5xl">

        {/* Left side — branding + code preview */}
        <div className="flex flex-col items-start gap-6 flex-1 max-w-lg">

          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Vide Editor</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Code. Create.<br />
              <span className="text-indigo-400">Ship faster.</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-sm">
              A full-featured browser-based code editor with AI assistance, WebContainer runtime, and real-time preview.
            </p>
          </div>

          {/* Fake code window */}
          <div className="w-full rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-zinc-500 font-mono">main.tsx</span>
            </div>
            {/* Code lines */}
            <div className="p-4 font-mono text-xs leading-6 select-none">
              <div><span className="text-violet-400">import</span> <span className="text-zinc-300">React</span> <span className="text-violet-400">from</span> <span className="text-emerald-400">'react'</span></div>
              <div className="mt-1"><span className="text-violet-400">export default function</span> <span className="text-yellow-300">App</span><span className="text-zinc-400">() {"{"}</span></div>
              <div><span className="text-zinc-500 pl-4">{"// "}AI suggests here ✦</span></div>
              <div><span className="text-zinc-400 pl-4">return</span> <span className="text-zinc-400">(</span></div>
              <div><span className="pl-8 text-blue-400">{"<div"}</span> <span className="text-emerald-300">className</span><span className="text-zinc-400">=</span><span className="text-orange-300">"app"</span><span className="text-blue-400">{">"}</span></div>
              <div><span className="pl-12 text-blue-400">{"<h1>"}</span><span className="text-zinc-300">Hello Vide</span><span className="text-blue-400">{"</h1>"}</span></div>
              <div><span className="pl-8 text-blue-400">{"</div>"}</span></div>
              <div><span className="pl-4 text-zinc-400">)</span></div>
              <div><span className="text-zinc-400">{"}"}</span></div>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["WebContainer", "AI Completion", "Live Preview", "Multi-tab"].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-zinc-400 border border-white/5">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right side — sign in card */}
        <div className="w-full max-w-sm">
          <SignInFormClient />
        </div>

      </div>
    </div>
  )
}

export default Page

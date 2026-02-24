"use client";

import {
  ArrowUpRight,
  Zap,
  Globe,
  GitBranch,
  Terminal,
  Cpu,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const templates = ["React", "Angular", "Hono", "Vue", "Next.js", "Express"];
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const word = templates[current];
    let i = typing ? 0 : word.length;

    const interval = setInterval(() => {
      if (typing) {
        setDisplayed(word.slice(0, i + 1));
        i++;
        if (i === word.length) {
          clearInterval(interval);
          setTimeout(() => setTyping(false), 1200);
        }
      } else {
        setDisplayed(word.slice(0, i - 1));
        i--;
        if (i === 0) {
          clearInterval(interval);
          setCurrent((prev) => (prev + 1) % templates.length);
          setTyping(true);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [current, typing]);
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050508]">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[300px] left-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[120px]" />
      <div className="pointer-events-none absolute top-[300px] right-[-100px] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px]" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-rose-500/5 px-4 py-1.5 text-xs font-medium text-indigo-400">
          <Zap className="w-3 h-3" />
          AI-Powered · WebContainer · Real-time Preview
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
          Code in{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-blue-800 bg-clip-text text-transparent">
            {displayed} |<span className="animate-pulse">|</span>
          </span>{" "}
          <br></br>
          Right in Browser
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed">
          VideCode Editor is a full-stack browser IDE with AI code completion,
          WebContainer runtime, live preview, and multi-language support — all
          in one tab.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <button className="group inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 text-sm transition-all duration-200 hover:shadow-rose-400/30 hover:-translate-y-0.5">
              Get Started Free
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Link>
          <Link href="/docs">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 text-zinc-300 hover:text-white font-medium px-6 py-3 text-sm transition-all duration-200">
              View Docs
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { value: "6+", label: "Starter templates" },
            { value: "AI", label: "Code completion" },
            { value: "0ms", label: "Setup time" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">{s.value}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Editor preview window */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
          {/* Window bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                App.tsx
              </span>
              <span className="text-xs text-zinc-600 font-mono">main.ts</span>
              <span className="text-xs text-zinc-600 font-mono">index.css</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-400/60 animate-pulse" />
              <span className="text-xs text-zinc-500">AI active</span>
            </div>
          </div>

          {/* Code — using pre to avoid JSX parsing issues with braces */}
          <div className="grid grid-cols-[40px_1fr] font-mono text-xs leading-6">
            {/* Line numbers */}
            <div className="py-4 text-right pr-3 text-zinc-700 select-none border-r border-white/5 bg-black/10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="px-2">
                  {n}
                </div>
              ))}
            </div>
            {/* Code content as pre to safely render all characters */}
            <pre className="px-5 py-4 overflow-x-auto text-xs leading-6 m-0 bg-transparent">{`import { useState } from 'react'
import { AICompletion } from '@vide/ai'

export default function App() {
  const [code, setCode] = useState('')
  // ✦ AI suggests next line...
  return (
    <div className="editor-container">
      <AICompletion value={code} onChange={setCode} />
    </div>
  )
}`}</pre>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-rose-500/10 border-t border-rose-500/10">
            <div className="flex items-center gap-4">
              <span className="text-xs text-rose-400 font-mono">
                TypeScript JSX
              </span>
              <span className="text-xs text-zinc-600">Ln 8, Col 42</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-500">
                WebContainer running
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Everything you need to build
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            No setup. No installs. Just open and code.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <Cpu className="w-5 h-5" />,
              title: "AI Completion",
              desc: "Context-aware suggestions powered by local LLMs via Ollama",
              color: "text-violet-400",
              bg: "bg-violet-500/10",
              border: "border-violet-500/10",
            },
            {
              icon: <Terminal className="w-5 h-5" />,
              title: "WebContainer",
              desc: "Full Node.js runtime in the browser — run npm, spawn processes",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              border: "border-emerald-500/10",
            },
            {
              icon: <Globe className="w-5 h-5" />,
              title: "Live Preview",
              desc: "See your app update in real-time as you type and save",
              color: "text-sky-400",
              bg: "bg-sky-500/10",
              border: "border-sky-500/10",
            },
            {
              icon: <Code2 className="w-5 h-5" />,
              title: "Monaco Editor",
              desc: "VS Code's editor engine with full syntax highlighting and IntelliSense",
              color: "text-rose-400",
              bg: "bg-rose-500/10",
              border: "border-rose-500/10",
            },
            {
              icon: <GitBranch className="w-5 h-5" />,
              title: "6+ Templates",
              desc: "React, Vue, Angular, Next.js, Express, Hono — ready instantly",
              color: "text-orange-400",
              bg: "bg-orange-500/10",
              border: "border-orange-500/10",
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Zero Config",
              desc: "Sign in and start coding — no local setup or installs needed",
              color: "text-yellow-400",
              bg: "bg-yellow-500/10",
              border: "border-yellow-500/10",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`rounded-xl border ${f.border} bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors`}
            >
              <div
                className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3 ${f.color}`}
              >
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {f.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

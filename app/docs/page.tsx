"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Globe,
  Terminal,
  Cpu,
  Code2,
  ChevronRight,
  BookOpen,
  Layers,
  Settings,
  ArrowUpRight,
  CheckCircle,
  Copy,
  Check,
  Key,
  AlertCircle,
} from "lucide-react";

const sidebarSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: ["Introduction", "Quick Start", "Installation", "Authentication"],
  },
  {
    title: "Templates",
    icon: Layers,
    items: [
      "React + TypeScript",
      "Next.js",
      "Vue.js",
      "Angular",
      "Hono",
      "Express",
    ],
  },
  {
    title: "Features",
    icon: Zap,
    items: [
      "AI Code Completion",
      "WebContainer",
      "Live Preview",
      "Monaco Editor",
      "Terminal",
    ],
  },
  {
    title: "API Reference",
    icon: Settings,
    items: ["Chat API", "Code Completion API", "Template API"],
  },
];

const templateDetails = [
  {
    name: "React + TypeScript",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    icon: "⚛️",
    useCase: "Best for: Frontend SPAs, dashboards, component libraries",
    description:
      "Modern React 18 app with full TypeScript support, Vite bundler, and hot module replacement.",
    features: [
      "TypeScript 5.x",
      "Vite build tool",
      "HMR support",
      "ESLint configured",
      "React 18",
    ],
    startCmd: "npm create vite@latest my-app -- --template react-ts",
    fileStructure:
      "my-app/\n├── src/\n│   ├── App.tsx\n│   ├── main.tsx\n│   └── index.css\n├── index.html\n├── vite.config.ts\n└── tsconfig.json",
  },
  {
    name: "Next.js",
    color: "text-white",
    bg: "bg-white/10",
    border: "border-white/20",
    icon: "▲",
    useCase: "Best for: Full-stack apps, SEO-heavy sites, e-commerce",
    description:
      "Full-stack Next.js 14 app with App Router, React Server Components, and built-in API routes.",
    features: [
      "App Router",
      "Server Components",
      "API Routes",
      "TypeScript ready",
      "Image Optimization",
    ],
    startCmd: "npx create-next-app@latest my-app",
    fileStructure:
      "my-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n│   └── api/\n├── public/\n└── next.config.ts",
  },
  {
    name: "Vue.js",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "💚",
    useCase: "Best for: Interactive UIs, progressive enhancement",
    description:
      "Vue 3 app with Composition API, Vite, and TypeScript. Gentle learning curve with powerful reactivity system.",
    features: [
      "Vue 3 Composition API",
      "Vite bundler",
      "TypeScript",
      "Vue Router ready",
      "<script setup>",
    ],
    startCmd: "npm create vite@latest my-app -- --template vue-ts",
    fileStructure:
      "my-app/\n├── src/\n│   ├── App.vue\n│   ├── main.ts\n│   └── components/\n├── index.html\n└── vite.config.ts",
  },
  {
    name: "Angular",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "🅰️",
    useCase: "Best for: Enterprise apps, large team projects",
    description:
      "Full Angular 17 setup with standalone components, signals, and modern architecture.",
    features: [
      "Angular 17",
      "Standalone Components",
      "TypeScript",
      "Angular Signals",
      "RxJS included",
    ],
    startCmd: "ng new my-app",
    fileStructure:
      "my-app/\n├── src/\n│   ├── app/\n│   │   ├── app.component.ts\n│   │   └── app.routes.ts\n│   └── main.ts\n└── angular.json",
  },
  {
    name: "Hono",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: "🔥",
    useCase: "Best for: REST APIs, edge functions, microservices",
    description:
      "Ultra-fast Hono backend framework. Runs on Node.js, Deno, Bun, and edge runtimes like Cloudflare Workers.",
    features: [
      "Ultra-fast routing",
      "Edge runtime support",
      "TypeScript",
      "Middleware support",
      "Zod validation ready",
    ],
    startCmd: "npm create hono@latest my-app",
    fileStructure:
      "my-app/\n├── src/\n│   └── index.ts\n├── package.json\n└── tsconfig.json",
  },
  {
    name: "Express",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: "🚂",
    useCase: "Best for: REST APIs, backend servers, quick prototypes",
    description:
      "Classic Node.js Express server with REST API boilerplate, CORS, and dotenv pre-configured.",
    features: [
      "Express 4.x",
      "REST API ready",
      "CORS configured",
      "dotenv support",
      "JSON middleware",
    ],
    startCmd: "npm init -y && npm install express cors dotenv",
    fileStructure:
      "my-app/\n├── routes/\n│   └── index.js\n├── middleware/\n├── index.js\n└── .env",
  },
];

const featureDetails = [
  {
    icon: Cpu,
    title: "AI Code Completion",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    description:
      "Context-aware AI code suggestions powered by Groq's Llama 3.3 70B model. The AI analyzes your cursor position, surrounding code, language, and framework to give highly relevant completions.",
    howTo: [
      "Open any file in the editor",
      "Start typing your code normally",
      "AI suggestions appear automatically as you type",
      "Press Tab to accept a suggestion",
      "Press Escape to dismiss the suggestion",
    ],
    details: [
      { label: "Model", value: "Llama 3.3 70B (via Groq)" },
      { label: "Max tokens", value: "300 per suggestion" },
      {
        label: "Languages",
        value: "TS, JS, Python, Go, Rust, Java, PHP, CSS, HTML",
      },
      { label: "Frameworks", value: "React, Vue, Angular, Next.js" },
      { label: "Temperature", value: "0.2 (precise completions)" },
    ],
    note: "Language is auto-detected from file extension. Framework is detected from import statements.",
  },
  {
    icon: Terminal,
    title: "WebContainer",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    description:
      "A full Node.js runtime running entirely in your browser using WebAssembly. Install npm packages, run scripts, spawn processes, and access a real filesystem — all without any backend server.",
    howTo: [
      "Open the Terminal panel at the bottom of the editor",
      "Run npm install to install project dependencies",
      "Run npm run dev to start your dev server",
      "Use any Node.js CLI tools like tsc, vite, eslint, etc.",
      "Files created in terminal sync instantly with the editor",
    ],
    details: [
      { label: "Runtime", value: "Node.js via WebAssembly" },
      { label: "Package manager", value: "npm (full support)" },
      { label: "File system", value: "In-memory, synced with editor" },
      { label: "Processes", value: "Multiple concurrent processes" },
      { label: "Network", value: "Proxied via WebContainer API" },
    ],
    note: "WebContainer boots in seconds. First npm install may take slightly longer as packages are fetched.",
  },
  {
    icon: Globe,
    title: "Live Preview",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    description:
      "See your running app in a live preview panel right inside the editor. The preview updates automatically when you save files using Hot Module Replacement (HMR).",
    howTo: [
      "Start your dev server in the Terminal (npm run dev)",
      "The Preview panel opens automatically",
      "Edit any file and save — changes reflect instantly via HMR",
      "Use the refresh button to hard reload if needed",
      "Click 'Open in new tab' for full-screen preview",
    ],
    details: [
      { label: "Update method", value: "HMR (Hot Module Replacement)" },
      { label: "Preview type", value: "Embedded iframe" },
      { label: "Port", value: "Auto-detected from dev server output" },
      { label: "Frameworks", value: "All frameworks with a dev server" },
    ],
    note: "Live Preview works with React, Vue, Angular, Next.js, and even plain HTML with a simple server.",
  },
  {
    icon: Code2,
    title: "Monaco Editor",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    description:
      "The same powerful editor engine that powers VS Code. Full syntax highlighting for 50+ languages, IntelliSense, multi-cursor editing, find & replace, and all the keyboard shortcuts you already know.",
    howTo: [
      "Ctrl+P — Quick open / search files",
      "Ctrl+Shift+P — Command palette",
      "Alt+Click — Add multiple cursors",
      "Ctrl+D — Select next occurrence of selection",
      "Ctrl+/ — Toggle line comment",
      "Alt+Up / Alt+Down — Move line up or down",
    ],
    details: [
      { label: "Languages", value: "50+ with full syntax highlighting" },
      { label: "Theme", value: "Dark (VS Code dark+)" },
      { label: "IntelliSense", value: "Type checking + autocomplete" },
      { label: "Minimap", value: "Enabled (toggleable)" },
      { label: "Format", value: "Prettier on save (configurable)" },
    ],
    note: "All standard VS Code keyboard shortcuts work exactly the same in Monaco Editor.",
  },
  {
    icon: Terminal,
    title: "Terminal",
    color: "text-zinc-300",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    description:
      "A fully functional terminal powered by xterm.js, connected to the WebContainer Node.js runtime. Run npm commands, execute scripts, manage files, and see real-time output from your processes.",
    howTo: [
      "Click the Terminal tab at the bottom panel",
      "Type any command and press Enter",
      "Run npm install to install packages",
      "Run npm run dev or npm start for your dev server",
      "Press Ctrl+C to stop a running process",
      "Type clear to clear the terminal output",
    ],
    details: [
      { label: "Terminal engine", value: "xterm.js" },
      { label: "Shell", value: "WebContainer shell (bash-like)" },
      { label: "npm support", value: "Full npm support" },
      { label: "Colors", value: "Full ANSI color support" },
      { label: "Resize", value: "Resizable panel" },
    ],
    note: "The terminal and editor share the same filesystem — files created in terminal appear in the explorer instantly.",
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative group mt-2">
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 font-mono overflow-x-auto whitespace-pre">
        {code}
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute right-2 top-2 p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  const colors = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POST: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span
      className={`text-xs font-bold border px-2 py-0.5 rounded ${colors[method]}`}
    >
      {method}
    </span>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("Introduction");

  const renderContent = () => {
    // ── INTRODUCTION ──
    if (activeSection === "Introduction") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Introduction</h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              Welcome to{" "}
              <span className="text-white font-semibold">VideCode Editor</span>{" "}
              — a full-stack browser IDE with AI code completion, WebContainer
              runtime, live preview, and multi-language support, all in one tab.
              No installations, no setup, just open and code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Cpu,
                label: "AI Powered",
                desc: "Llama 3.3 70B via Groq",
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                icon: Terminal,
                label: "WebContainer",
                desc: "Node.js runtime in browser",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Globe,
                label: "Live Preview",
                desc: "Real-time HMR updates",
                color: "text-sky-400",
                bg: "bg-sky-500/10",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border border-white/8 ${item.bg} p-4`}
              >
                <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Key Features
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {[
                "Zero setup — open browser and start coding instantly",
                "6 starter templates: React, Next.js, Vue, Angular, Hono, Express",
                "AI assistant with Chat, Code Review, Fix, and Optimize modes",
                "Full terminal with npm support via WebContainer",
                "Monaco Editor — the same engine as VS Code",
                "Live preview with Hot Module Replacement (HMR)",
                "Export chat history as JSON",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">Tech Stack</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {[
                { label: "Framework", value: "Next.js 14 (App Router)" },
                { label: "AI Model", value: "Llama 3.3 70B via Groq" },
                { label: "Editor", value: "Monaco Editor" },
                { label: "Terminal", value: "xterm.js + WebContainer" },
                { label: "Auth", value: "NextAuth.js" },
                { label: "Database", value: "Prisma ORM" },
                { label: "Styling", value: "Tailwind CSS + shadcn/ui" },
                { label: "Language", value: "TypeScript" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between border-b border-zinc-800/50 pb-1"
                >
                  <span className="text-zinc-500">{item.label}</span>
                  <span className="text-zinc-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── QUICK START ──
    if (activeSection === "Quick Start") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white mb-1">Quick Start</h1>
          <p className="text-zinc-400">
            Get up and running in under a minute — no installation needed.
          </p>
          <div className="space-y-5">
            {[
              {
                step: "1",
                title: "Sign In",
                desc: "Go to the home page and click Get Started. Sign in with GitHub or Google — no password needed.",
                code: null,
              },
              {
                step: "2",
                title: "Create a New Project",
                desc: "From your Dashboard, click New Project. Choose a template that fits your stack.",
                code: null,
              },
              {
                step: "3",
                title: "Editor Loads Instantly",
                desc: "The Monaco editor, file explorer, and terminal open automatically. No waiting, no configuration.",
                code: null,
              },
              {
                step: "4",
                title: "Install Dependencies",
                desc: "Open the Terminal tab and install your project packages.",
                code: "npm install",
              },
              {
                step: "5",
                title: "Start Your Dev Server",
                desc: "Run the dev server and see your app live in the Preview panel.",
                code: "npm run dev",
              },
              {
                step: "6",
                title: "Use the AI Assistant",
                desc: "Click the AI button (brain icon) to open the AI Assistant. Use Chat, Review, Fix, or Optimize modes.",
                code: null,
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                  {item.code && <CodeBlock code={item.code} />}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Done! You are now coding with
              AI in your browser.
            </p>
          </div>
        </div>
      );
    }

    // ── INSTALLATION ──
    if (activeSection === "Installation") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white mb-1">Installation</h1>
          <p className="text-zinc-400">
            To run VideCode Editor locally for development, follow these steps.
          </p>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-sm">
              You need Node.js 18+ and a Groq API key to run locally.
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="text-white font-semibold mb-1">
                1. Clone the repository
              </h3>
              <CodeBlock
                code={
                  "git clone https://github.com/Shanvi30/Vide-Code-Editor\ncd vide-code-editor"
                }
              />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                2. Install dependencies
              </h3>
              <CodeBlock code="npm install" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                3. Set up environment variables
              </h3>
              <p className="text-zinc-400 text-sm mb-1">
                Create a{" "}
                <code className="bg-zinc-800 px-1 rounded text-zinc-300">
                  .env.local
                </code>{" "}
                file in the root:
              </p>
              <CodeBlock
                code={
                  "# Groq API Key (required for AI features)\nGROQ_API_KEY=your_groq_api_key_here\n\n# NextAuth\nNEXTAUTH_SECRET=your_nextauth_secret\nNEXTAUTH_URL=http://localhost:3000\n\n# GitHub OAuth\nGITHUB_CLIENT_ID=your_github_client_id\nGITHUB_CLIENT_SECRET=your_github_client_secret\n\n# Google OAuth (optional)\nGOOGLE_CLIENT_ID=your_google_client_id\nGOOGLE_CLIENT_SECRET=your_google_client_secret\n\n# Database\nDATABASE_URL=your_database_url"
                }
              />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                4. Set up the database
              </h3>
              <CodeBlock code={"npx prisma generate\nnpx prisma db push"} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                5. Run the dev server
              </h3>
              <CodeBlock code="npm run dev" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                6. Open in browser
              </h3>
              <CodeBlock code="http://localhost:3000" />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-zinc-400" /> Get a Groq API Key
              (Free)
            </h3>
            <ol className="space-y-1 text-sm text-zinc-400 list-decimal list-inside">
              <li>
                Go to <span className="text-blue-400">console.groq.com</span>
              </li>
              <li>Create a free account</li>
              <li>Go to API Keys section</li>
              <li>Click Create API Key and copy it</li>
              <li>Paste it as GROQ_API_KEY in your .env.local</li>
            </ol>
          </div>
        </div>
      );
    }

    // ── AUTHENTICATION ──
    if (activeSection === "Authentication") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white mb-1">Authentication</h1>
          <p className="text-zinc-400">
            VideCode uses NextAuth.js for secure, OAuth-based authentication. No
            passwords are stored.
          </p>
          <div className="space-y-4">
            {[
              {
                title: "GitHub OAuth",
                icon: "🐙",
                desc: "Sign in with your GitHub account in one click.",
                steps: [
                  "Click Get Started on the home page",
                  "Click Sign in with GitHub",
                  "Authorize the VideCode app",
                  "Your dashboard opens instantly",
                ],
                color: "text-white",
                bg: "bg-white/5",
                border: "border-white/15",
              },
              {
                title: "Google OAuth",
                icon: "🔵",
                desc: "Sign in with your Google account for passwordless access.",
                steps: [
                  "Click Get Started on the home page",
                  "Click Sign in with Google",
                  "Choose your Google account",
                  "You are redirected to your dashboard",
                ],
                color: "text-blue-400",
                bg: "bg-blue-500/5",
                border: "border-blue-500/20",
              },
            ].map((provider) => (
              <div
                key={provider.title}
                className={`rounded-xl border ${provider.border} ${provider.bg} p-5`}
              >
                <h3
                  className={`${provider.color} font-semibold mb-1 flex items-center gap-2`}
                >
                  <span>{provider.icon}</span> {provider.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-3">{provider.desc}</p>
                <ol className="space-y-1">
                  {provider.steps.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <span className="text-zinc-600 shrink-0">{i + 1}.</span>{" "}
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">Session Details</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Strategy", value: "JWT tokens" },
                { label: "Session duration", value: "30 days" },
                { label: "Auto-refresh", value: "Yes" },
                {
                  label: "Protected routes",
                  value: "/dashboard, /playground, /settings",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between border-b border-zinc-800/50 pb-1"
                >
                  <span className="text-zinc-500">{row.label}</span>
                  <span className="text-zinc-300">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">
              OAuth Callback URLs (for local dev)
            </h3>
            <CodeBlock
              code={
                "# GitHub\nCallback URL: http://localhost:3000/api/auth/callback/github\n\n# Google\nRedirect URI: http://localhost:3000/api/auth/callback/google"
              }
            />
          </div>
        </div>
      );
    }

    // ── TEMPLATE SECTIONS ──
    const template = templateDetails.find((t) => t.name === activeSection);
    if (template) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{template.name}</h1>
              <p className="text-zinc-500 text-sm mt-0.5">{template.useCase}</p>
            </div>
          </div>
          <p className="text-zinc-400 text-base leading-relaxed">
            {template.description}
          </p>
          <div
            className={`rounded-xl border ${template.border} ${template.bg} p-5`}
          >
            <h3 className={`${template.color} font-semibold mb-3`}>
              What is included
            </h3>
            <ul className="space-y-2">
              {template.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <CheckCircle
                    className={`w-4 h-4 ${template.color} shrink-0`}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white font-semibold mb-1">Start command</h3>
              <CodeBlock code={template.startCmd} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">File structure</h3>
              <CodeBlock code={template.fileStructure} />
            </div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
            <h3 className="text-white font-semibold mb-3">
              Use in VideCode Editor
            </h3>
            <ol className="space-y-2">
              {[
                "Go to your Dashboard",
                "Click New Project",
                `Select the ${template.name} template`,
                "Editor loads instantly — start coding",
                "Open Terminal and run npm install",
                "Run npm run dev to see live preview",
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-sm text-zinc-400"
                >
                  <span
                    className={`text-xs font-bold ${template.color} shrink-0 mt-0.5`}
                  >
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    }

    // ── FEATURE SECTIONS ──
    const feature = featureDetails.find((f) => f.title === activeSection);
    if (feature) {
      return (
        <div className="space-y-6">
          <div
            className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center`}
          >
            <feature.icon className={`w-6 h-6 ${feature.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-white">{feature.title}</h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            {feature.description}
          </p>

          <div
            className={`rounded-xl border ${feature.border} ${feature.bg} p-5`}
          >
            <h3 className={`${feature.color} font-semibold mb-3`}>
              How to use
            </h3>
            <ol className="space-y-2">
              {feature.howTo.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <span
                    className={`w-5 h-5 rounded-full ${feature.bg} border ${feature.border} flex items-center justify-center text-xs ${feature.color} font-bold shrink-0`}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">Technical Details</h3>
            <div className="space-y-2 text-sm">
              {feature.details.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between border-b border-zinc-800/50 pb-1"
                >
                  <span className="text-zinc-500">{row.label}</span>
                  <span className="text-zinc-300 text-right max-w-[60%]">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-zinc-400 text-sm">{feature.note}</p>
          </div>
        </div>
      );
    }

    // ── CHAT API ──
    if (activeSection === "Chat API") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Chat API</h1>
          <p className="text-zinc-400">
            Send messages to the AI assistant and receive responses. Supports
            both streaming and non-streaming modes.
          </p>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MethodBadge method="POST" />
              <code className="text-zinc-300 text-sm">/api/chat</code>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Request Body
              </h4>
              <CodeBlock
                code={
                  '{\n  "message": "string",          // required — user message\n  "history": [                   // optional — last 10 messages\n    { "role": "user", "content": "..." },\n    { "role": "assistant", "content": "..." }\n  ],\n  "stream": true,               // optional — stream response (default: false)\n  "mode": "chat",               // optional — "chat" | "review" | "fix" | "optimize"\n  "model": "llama-3.3-70b-versatile"  // optional — AI model to use\n}'
                }
              />
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Response (non-streaming)
              </h4>
              <CodeBlock
                code={
                  '{\n  "response": "string",         // AI response text\n  "model": "llama-3.3-70b-versatile",\n  "timestamp": "2024-01-01T00:00:00.000Z"\n}'
                }
              />
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Response (streaming)
              </h4>
              <p className="text-zinc-400 text-sm mb-2">
                Returns a text/event-stream. Each chunk is a JSON object:
              </p>
              <CodeBlock
                code={
                  'data: { "text": "partial response..." }\ndata: { "text": "more text..." }\ndata: [DONE]'
                }
              />
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Error Response
              </h4>
              <CodeBlock
                code={
                  '{\n  "error": "Failed to generate AI response",\n  "details": "error message",\n  "timestamp": "2024-01-01T00:00:00.000Z"\n}'
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">Mode Prompts</h3>
            <div className="space-y-2 text-sm">
              {[
                {
                  mode: "chat",
                  desc: "General coding assistant — answers questions and writes code",
                },
                {
                  mode: "review",
                  desc: "Reviews code for performance, security, and best practices",
                },
                {
                  mode: "fix",
                  desc: "Identifies and fixes bugs, errors, and potential problems",
                },
                {
                  mode: "optimize",
                  desc: "Analyzes code for performance bottlenecks and improvements",
                },
              ].map((row) => (
                <div
                  key={row.mode}
                  className="flex gap-3 border-b border-zinc-800/50 pb-2"
                >
                  <code className="text-violet-400 text-xs bg-violet-500/10 px-2 py-0.5 rounded shrink-0 h-fit">
                    {row.mode}
                  </code>
                  <span className="text-zinc-400">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── CODE COMPLETION API ──
    if (activeSection === "Code Completion API") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Code Completion API</h1>
          <p className="text-zinc-400">
            Get AI-powered code completions based on cursor position and
            surrounding code context.
          </p>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MethodBadge method="POST" />
              <code className="text-zinc-300 text-sm">
                /api/code-completion
              </code>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Request Body
              </h4>
              <CodeBlock
                code={
                  '{\n  "fileContent": "string",      // required — full file content\n  "cursorLine": 5,              // required — cursor line (0-indexed)\n  "cursorColumn": 20,           // required — cursor column\n  "suggestionType": "string",   // required — type of suggestion\n  "fileName": "App.tsx"         // optional — used to detect language\n}'
                }
              />
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Response
              </h4>
              <CodeBlock
                code={
                  '{\n  "suggestion": "const [count, setCount] = useState(0)",\n  "context": {\n    "language": "TypeScript",\n    "framework": "React",\n    "isInFunction": true,\n    "isInClass": false,\n    "incompletePatterns": ["assignment"]\n  },\n  "metadata": {\n    "language": "TypeScript",\n    "framework": "React",\n    "position": { "line": 5, "column": 20 },\n    "generatedAt": "2024-01-01T00:00:00.000Z"\n  }\n}'
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">
              Language Auto-Detection
            </h3>
            <p className="text-zinc-400 text-sm mb-3">
              Language is auto-detected from file extension or code patterns:
            </p>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              {[
                { ext: ".ts / .tsx", lang: "TypeScript" },
                { ext: ".js / .jsx", lang: "JavaScript" },
                { ext: ".py", lang: "Python" },
                { ext: ".go", lang: "Go" },
                { ext: ".rs", lang: "Rust" },
                { ext: ".java", lang: "Java" },
                { ext: ".php", lang: "PHP" },
                { ext: ".css", lang: "CSS" },
              ].map((row) => (
                <div key={row.ext} className="flex gap-2">
                  <code className="text-emerald-400 text-xs">{row.ext}</code>
                  <span className="text-zinc-500">→</span>
                  <span className="text-zinc-300 text-xs">{row.lang}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">
              Framework Auto-Detection
            </h3>
            <div className="space-y-1 text-sm">
              {[
                { trigger: "import React or useState", framework: "React" },
                { trigger: "import Vue or <template>", framework: "Vue" },
                { trigger: "@angular/ or @Component", framework: "Angular" },
                {
                  trigger: "next/ or getServerSideProps",
                  framework: "Next.js",
                },
              ].map((row) => (
                <div
                  key={row.framework}
                  className="flex gap-2 border-b border-zinc-800/50 pb-1"
                >
                  <code className="text-zinc-400 text-xs flex-1">
                    {row.trigger}
                  </code>
                  <span className="text-violet-400 text-xs font-medium">
                    {row.framework}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── TEMPLATE API ──
    if (activeSection === "Template API") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Template API</h1>
          <p className="text-zinc-400">
            Fetch available starter templates and create new projects.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="text-zinc-300 text-sm">/api/template</code>
              </div>
              <p className="text-zinc-400 text-sm">
                Returns list of all available starter templates.
              </p>
              <div>
                <h4 className="text-white text-sm font-semibold mb-1">
                  Response
                </h4>
                <CodeBlock
                  code={
                    '[\n  {\n    "id": "react-ts",\n    "name": "React + TypeScript",\n    "description": "...",\n    "icon": "⚛️"\n  },\n  {\n    "id": "nextjs",\n    "name": "Next.js",\n    "description": "...",\n    "icon": "▲"\n  }\n  // ... more templates\n]'
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <MethodBadge method="POST" />
                <code className="text-zinc-300 text-sm">/api/template</code>
              </div>
              <p className="text-zinc-400 text-sm">
                Create a new project from a starter template.
              </p>
              <div>
                <h4 className="text-white text-sm font-semibold mb-1">
                  Request Body
                </h4>
                <CodeBlock
                  code={
                    '{\n  "templateId": "react-ts",     // "react-ts" | "nextjs" | "vue" | "angular" | "hono" | "express"\n  "projectName": "my-project"  // your project name\n}'
                  }
                />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-1">
                  Response
                </h4>
                <CodeBlock
                  code={
                    '{\n  "projectId": "clxxxxxx",\n  "name": "my-project",\n  "templateId": "react-ts",\n  "createdAt": "2024-01-01T00:00:00.000Z",\n  "playgroundUrl": "/playground/clxxxxxx"\n}'
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-white font-semibold mb-3">
              Available Template IDs
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {[
                { id: "react-ts", name: "React + TypeScript" },
                { id: "nextjs", name: "Next.js" },
                { id: "vue", name: "Vue.js" },
                { id: "angular", name: "Angular" },
                { id: "hono", name: "Hono" },
                { id: "express", name: "Express" },
              ].map((t) => (
                <div key={t.id} className="flex gap-2 items-center">
                  <code className="text-emerald-400 text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {t.id}
                  </code>
                  <span className="text-zinc-400">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav className="w-full max-w-5xl flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/60 backdrop-blur-xl px-4 py-2.5 shadow-2xl shadow-black/40">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Image src="/logo.svg" alt="Logo" height={20} width={20} />
            </div>
            <span className="hidden sm:block font-bold text-sm text-white tracking-tight">
              VideCode <span className="text-blue-400">Editor</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="text-white font-medium">Documentation</span>
          </div>
          <Link href="/dashboard">
            <button className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors">
              Get Started <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </nav>
      </div>

      {/* Layout */}
      <div className="flex pt-20 max-w-6xl mx-auto px-4 min-h-screen">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 py-8 pr-6 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-2">
                <section.icon className="w-3.5 h-3.5" />
                {section.title}
              </div>
              {section.items.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                    activeSection === item
                      ? "bg-blue-500/15 text-blue-400 font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item}
                  {activeSection === item && (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Divider */}
        <div className="w-px bg-white/5 mx-2 self-stretch" />

        {/* Main Content */}
        <main className="flex-1 py-8 pl-8 pb-24 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

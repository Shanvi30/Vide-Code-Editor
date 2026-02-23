"use client";
import React, { useEffect, useState, useRef } from "react";

import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle, Code2 } from "lucide-react";

import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";
import TerminalComponent from "./terminal";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean;
}

const STEPS = [
  { label: "Transforming template data", index: 1 },
  { label: "Mounting files",             index: 2 },
  { label: "Installing dependencies",    index: 3 },
  { label: "Starting development server",index: 4 },
];

const WebContainerPreview = ({
  templateData,
  error,
  instance,
  isLoading,
  serverUrl,
  writeFileSync,
  forceResetup = false,
}: WebContainerPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);

  const terminalRef = useRef<any>(null);

  useEffect(() => {
    if (forceResetup) {
      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setPreviewUrl("");
      setCurrentStep(0);
      setLoadingState({ transforming: false, mounting: false, installing: false, starting: false, ready: false });
    }
  }, [forceResetup]);

  useEffect(() => {
    async function setupContainer() {
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true);
        setSetupError(null);

        try {
          const packageJsonExists = await instance.fs.readFile("package.json", "utf8");
          if (packageJsonExists) {
            if (terminalRef.current?.writeToTerminal) {
              terminalRef.current.writeToTerminal("🔄 Reconnecting to existing WebContainer session...\r\n");
            }
            instance.on("server-ready", (port: number, url: string) => {
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(`🌐 Reconnected to server at ${url}\r\n`);
              }
              setPreviewUrl(url);
              setLoadingState((prev) => ({ ...prev, starting: false, ready: true }));
            });
            setCurrentStep(4);
            setLoadingState((prev) => ({ ...prev, starting: true }));
            return;
          }
        } catch (error) {}

        // Step 1 — Transform
        setLoadingState((prev) => ({ ...prev, transforming: true }));
        setCurrentStep(1);
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("🔄 Transforming template data...\r\n");
        }
        // @ts-ignore
        const files = transformToWebContainerFormat(templateData);
        setLoadingState((prev) => ({ ...prev, transforming: false, mounting: true }));
        setCurrentStep(2);

        // Step 2 — Mount
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("📁 Mounting files to WebContainer...\r\n");
        }
        await instance.mount(files);
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("✅ Files mounted successfully\r\n");
        }
        setLoadingState((prev) => ({ ...prev, mounting: false, installing: true }));
        setCurrentStep(3);

        // Step 3 — Install
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("📦 Installing dependencies...\r\n");
        }
        const installProcess = await instance.spawn("npm", ["install", "--prefer-offline", "--no-audit", "--no-fund"]);
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            if (terminalRef.current?.writeToTerminal) terminalRef.current.writeToTerminal(data);
          },
        }));
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) throw new Error(`Failed to install dependencies. Exit code: ${installExitCode}`);
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("✅ Dependencies installed successfully\r\n");
        }
        setLoadingState((prev) => ({ ...prev, installing: false, starting: true }));
        setCurrentStep(4);

        // Step 4 — Start server
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal("🚀 Starting development server...\r\n");
        }
        const startProcess = await instance.spawn("npm", ["run", "start"]);
        instance.on("server-ready", (port: number, url: string) => {
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(`🌐 Server ready at ${url}\r\n`);
          }
          setPreviewUrl(url);
          setLoadingState((prev) => ({ ...prev, starting: false, ready: true }));
          setIsSetupComplete(true);
          setIsSetupInProgress(false);
        });
        startProcess.output.pipeTo(new WritableStream({
          write(data) {
            if (terminalRef.current?.writeToTerminal) terminalRef.current.writeToTerminal(data);
          },
        }));
      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(`❌ Error: ${errorMessage}\r\n`);
        }
        setSetupError(errorMessage);
        setIsSetupInProgress(false);
        setLoadingState({ transforming: false, mounting: false, installing: false, starting: false, ready: false });
      }
    }
    setupContainer();
  }, [instance, templateData, isSetupComplete, isSetupInProgress]);

  useEffect(() => { return () => {}; }, []);

  // ── WebContainer still booting ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#07080f]">
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Spinning logo ring */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Initializing WebContainer</h3>
            <p className="text-xs text-zinc-500 mt-1">Setting up the environment for your project...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error || setupError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#07080f]">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center px-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Setup Failed</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{error || setupError}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Step helpers ────────────────────────────────────────────────────────────
  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return (
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
        </div>
      );
    } else if (stepIndex === currentStep) {
      return (
        <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
        </div>
      );
    } else {
      return (
        <div className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.03]" />
      );
    }
  };

  const getStepLabel = (stepIndex: number, label: string) => {
    const isComplete = stepIndex < currentStep;
    const isActive   = stepIndex === currentStep;
    return (
      <span className={`text-xs font-medium transition-colors ${
        isComplete ? "text-emerald-400" : isActive ? "text-white" : "text-zinc-600"
      }`}>
        {label}
      </span>
    );
  };

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full flex flex-col bg-[#07080f]">
      {!previewUrl ? (
        <div className="h-full flex flex-col">

          {/* ── Setup progress — CENTERED ── */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-xs">

              {/* Header */}
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border border-indigo-500/15" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-white">Setting up environment</h3>
                  <p className="text-xs text-zinc-500 mt-1">This may take a moment...</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-white/5 mb-6 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-3">
                {STEPS.map((step) => (
                  <div key={step.index} className="flex items-center gap-3">
                    {getStepIcon(step.index)}
                    {getStepLabel(step.index, step.label)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal — smaller, at bottom */}
          <div className="h-48 border-t border-white/5">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>
          <div className="h-48 border-t border-white/5">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
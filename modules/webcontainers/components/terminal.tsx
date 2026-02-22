"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

// TYPE-ONLY imports — zero runtime, 100% SSR safe.
// xterm touches browser globals (self, window) at import time.
// Even with "use client", Next.js SSR still evaluates the module on the server,
// which crashes with "self is not defined". All real xterm imports are deferred
// inside useEffect so they only ever run in the browser.
import type { Terminal } from "xterm";
import type { FitAddon } from "xterm-addon-fit";
import type { SearchAddon } from "xterm-addon-search";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = "dark" | "light";

interface TerminalProps {
  webcontainerUrl?: string;
  className?: string;
  theme?: Theme;
  webContainerInstance?: any;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
}

// ─── Theme map (outside component so it never re-creates) ─────────────────────

const TERMINAL_THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    background: "#09090B",
    foreground: "#FAFAFA",
    cursor: "#FAFAFA",
    cursorAccent: "#09090B",
    selection: "#27272A",
    black: "#18181B",
    red: "#EF4444",
    green: "#22C55E",
    yellow: "#EAB308",
    blue: "#3B82F6",
    magenta: "#A855F7",
    cyan: "#06B6D4",
    white: "#F4F4F5",
    brightBlack: "#3F3F46",
    brightRed: "#F87171",
    brightGreen: "#4ADE80",
    brightYellow: "#FDE047",
    brightBlue: "#60A5FA",
    brightMagenta: "#C084FC",
    brightCyan: "#22D3EE",
    brightWhite: "#FFFFFF",
  },
  light: {
    background: "#FFFFFF",
    foreground: "#18181B",
    cursor: "#18181B",
    cursorAccent: "#FFFFFF",
    selection: "#E4E4E7",
    black: "#18181B",
    red: "#DC2626",
    green: "#16A34A",
    yellow: "#CA8A04",
    blue: "#2563EB",
    magenta: "#9333EA",
    cyan: "#0891B2",
    white: "#F4F4F5",
    brightBlack: "#71717A",
    brightRed: "#EF4444",
    brightGreen: "#22C55E",
    brightYellow: "#EAB308",
    brightBlue: "#3B82F6",
    brightMagenta: "#A855F7",
    brightCyan: "#06B6D4",
    brightWhite: "#FAFAFA",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(
  (
    {
      webcontainerUrl,
      className,
      theme = "dark",
      webContainerInstance,
    }: TerminalProps,
    ref,
  ) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<Terminal | null>(null);
    const fitAddon = useRef<FitAddon | null>(null);
    const searchAddon = useRef<SearchAddon | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const currentLine = useRef<string>("");
    const cursorPosition = useRef<number>(0);
    const commandHistory = useRef<string[]>([]);
    const historyIndex = useRef<number>(-1);
    const currentProcess = useRef<any>(null);
    const shellProcess = useRef<any>(null);

    const activeTheme = TERMINAL_THEMES[theme];

    // ── Prompt ────────────────────────────────────────────────────────────────

    const writePrompt = useCallback(() => {
      if (term.current) {
        term.current.write("\r\n$ ");
        currentLine.current = "";
        cursorPosition.current = 0;
      }
    }, []);

    // ── Exposed ref methods ───────────────────────────────────────────────────

    useImperativeHandle(ref, () => ({
      writeToTerminal: (data: string) => {
        term.current?.write(data);
      },
      clearTerminal: () => {
        clearTerminalDisplay();
      },
      focusTerminal: () => {
        term.current?.focus();
      },
    }));

    // ── Command execution ─────────────────────────────────────────────────────

    const executeCommand = useCallback(
      async (command: string) => {
        if (!webContainerInstance || !term.current) return;

        if (
          command.trim() &&
          commandHistory.current[commandHistory.current.length - 1] !== command
        ) {
          commandHistory.current.push(command);
        }
        historyIndex.current = -1;

        try {
          if (command.trim() === "clear") {
            term.current.clear();
            writePrompt();
            return;
          }

          if (command.trim() === "history") {
            commandHistory.current.forEach((cmd: string, index: number) => {
              term.current!.writeln(`  ${index + 1}  ${cmd}`);
            });
            writePrompt();
            return;
          }

          if (command.trim() === "") {
            writePrompt();
            return;
          }

          const parts = command.trim().split(" ");
          const cmd = parts[0];
          const args = parts.slice(1);

          term.current.writeln("");
          const process = await webContainerInstance.spawn(cmd, args, {
            terminal: { cols: term.current.cols, rows: term.current.rows },
          });

          currentProcess.current = process;

          process.output.pipeTo(
            new WritableStream({
              write(data: string) {
                term.current?.write(data);
              },
            }),
          );

          await process.exit;
          currentProcess.current = null;
          writePrompt();
        } catch {
          term.current?.writeln(`\r\nCommand not found: ${command}`);
          writePrompt();
          currentProcess.current = null;
        }
      },
      [webContainerInstance, writePrompt],
    );

    // ── Keyboard handler ──────────────────────────────────────────────────────

    const handleTerminalInput = useCallback(
      (data: string) => {
        if (!term.current) return;

        switch (data) {
          case "\r":
            executeCommand(currentLine.current);
            break;

          case "\u007F": // Backspace
            if (cursorPosition.current > 0) {
              currentLine.current =
                currentLine.current.slice(0, cursorPosition.current - 1) +
                currentLine.current.slice(cursorPosition.current);
              cursorPosition.current--;
              term.current.write("\b \b");
            }
            break;

          case "\u0003": // Ctrl+C
            if (currentProcess.current) {
              currentProcess.current.kill();
              currentProcess.current = null;
            }
            term.current.writeln("^C");
            writePrompt();
            break;

          case "\u001b[A": // Up arrow
            if (commandHistory.current.length > 0) {
              if (historyIndex.current === -1) {
                historyIndex.current = commandHistory.current.length - 1;
              } else if (historyIndex.current > 0) {
                historyIndex.current--;
              }
              const upCmd = commandHistory.current[historyIndex.current];
              term.current.write(
                "\r$ " + " ".repeat(currentLine.current.length) + "\r$ ",
              );
              term.current.write(upCmd);
              currentLine.current = upCmd;
              cursorPosition.current = upCmd.length;
            }
            break;

          case "\u001b[B": // Down arrow
            if (historyIndex.current !== -1) {
              if (historyIndex.current < commandHistory.current.length - 1) {
                historyIndex.current++;
                const downCmd = commandHistory.current[historyIndex.current];
                term.current.write(
                  "\r$ " + " ".repeat(currentLine.current.length) + "\r$ ",
                );
                term.current.write(downCmd);
                currentLine.current = downCmd;
                cursorPosition.current = downCmd.length;
              } else {
                historyIndex.current = -1;
                term.current.write(
                  "\r$ " + " ".repeat(currentLine.current.length) + "\r$ ",
                );
                currentLine.current = "";
                cursorPosition.current = 0;
              }
            }
            break;

          default:
            if (data >= " " || data === "\t") {
              currentLine.current =
                currentLine.current.slice(0, cursorPosition.current) +
                data +
                currentLine.current.slice(cursorPosition.current);
              cursorPosition.current++;
              term.current.write(data);
            }
            break;
        }
      },
      [executeCommand, writePrompt],
    );

    // ── WebContainer connection ───────────────────────────────────────────────

    const connectToWebContainer = useCallback(async () => {
      if (!webContainerInstance || !term.current) return;
      try {
        setIsConnected(true);
        term.current.writeln("✅ Connected to WebContainer");
        term.current.writeln("Ready to execute commands");
        writePrompt();
      } catch {
        setIsConnected(false);
        term.current?.writeln("❌ Failed to connect to WebContainer");
      }
    }, [webContainerInstance, writePrompt]);

    // ── Toolbar actions ───────────────────────────────────────────────────────

    const clearTerminalDisplay = useCallback(() => {
      if (term.current) {
        term.current.clear();
        term.current.writeln("🚀 WebContainer Terminal");
        writePrompt();
      }
    }, [writePrompt]);

    const copyTerminalContent = useCallback(async () => {
      const content = term.current?.getSelection();
      if (content) {
        try {
          await navigator.clipboard.writeText(content);
        } catch {
          // clipboard denied — ignore silently
        }
      }
    }, []);

    const downloadTerminalLog = useCallback(() => {
      if (!term.current) return;
      const buffer = term.current.buffer.active;
      let content = "";
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) content += line.translateToString(true) + "\n";
      }
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `terminal-log-${new Date().toISOString().slice(0, 19)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, []);

    const searchInTerminal = useCallback((query: string) => {
      if (searchAddon.current && query) {
        searchAddon.current.findNext(query);
      }
    }, []);

    // ── Dynamic xterm init — browser only ────────────────────────────────────

    useEffect(() => {
      setIsMounted(true);

      if (!terminalRef.current || term.current) return;

      let resizeObserver: ResizeObserver | null = null;

      (async () => {
        const { Terminal } = await import("xterm");
        const { FitAddon } = await import("xterm-addon-fit");
        const { WebLinksAddon } = await import("xterm-addon-web-links");
        const { SearchAddon } = await import("xterm-addon-search");

        if (!terminalRef.current) return;

        const terminal = new Terminal({
          cursorBlink: true,
          fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
          fontSize: 14,
          lineHeight: 1.2,
          letterSpacing: 0,
          theme: TERMINAL_THEMES[theme],
          allowTransparency: false,
          convertEol: true,
          scrollback: 1000,
          tabStopWidth: 4,
        });

        const fitAddonInstance = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        const searchAddonInstance = new SearchAddon();

        terminal.loadAddon(fitAddonInstance);
        terminal.loadAddon(webLinksAddon);
        terminal.loadAddon(searchAddonInstance);

        terminal.open(terminalRef.current);

        fitAddon.current = fitAddonInstance;
        searchAddon.current = searchAddonInstance;
        term.current = terminal;

        terminal.onData(handleTerminalInput);
        setTimeout(() => fitAddonInstance.fit(), 100);

        terminal.writeln("🚀 WebContainer Terminal");
        terminal.writeln("Type a command and press Enter");
        writePrompt();

        resizeObserver = new ResizeObserver(() => {
          setTimeout(() => fitAddon.current?.fit(), 100);
        });
        resizeObserver.observe(terminalRef.current!);
      })();

      return () => {
        resizeObserver?.disconnect();
        if (currentProcess.current) currentProcess.current.kill();
        if (shellProcess.current) shellProcess.current.kill();
        if (term.current) {
          term.current.dispose();
          term.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (webContainerInstance && term.current && !isConnected) {
        connectToWebContainer();
      }
    }, [webContainerInstance, connectToWebContainer, isConnected]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
      <div
        className={cn(
          "flex flex-col h-full bg-background border rounded-lg overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium">WebContainer Terminal</span>
            {isConnected && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {showSearch && (
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value);
                  searchInTerminal(e.target.value);
                }}
                className="h-6 w-32 text-xs"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch((s) => !s)}
              className="h-6 w-6 p-0"
            >
              <Search className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyTerminalContent}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadTerminalLog}
              className="h-6 w-6 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTerminalDisplay}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Terminal body */}
        <div className="flex-1 relative">
          {!isMounted ? (
            <div
              className="absolute inset-0 p-2 flex items-center justify-center"
              style={{ background: activeTheme.background }}
            >
              <span
                className="text-xs"
                style={{ color: activeTheme.foreground, opacity: 0.4 }}
              >
                Initializing terminal...
              </span>
            </div>
          ) : (
            <div
              ref={terminalRef}
              className="absolute inset-0 p-2"
              style={{ background: activeTheme.background }}
            />
          )}
        </div>
      </div>
    );
  },
);

TerminalComponent.displayName = "TerminalComponent";

export default TerminalComponent;

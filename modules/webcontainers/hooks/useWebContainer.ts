import { useState, useEffect, useCallback, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

// ─── Module-level singleton ───────────────────────────────────────────────────
// WebContainer can only be booted ONCE per page load. Storing it outside the
// hook prevents React re-renders / Strict Mode double-invocations from trying
// to boot a second instance and crashing with:
// "Only a single WebContainer instance can be booted"
let globalInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

function getOrBootWebContainer(): Promise<WebContainer> {
  if (globalInstance) {
    return Promise.resolve(globalInstance);
  }
  if (bootPromise) {
    return bootPromise;
  }
  bootPromise = WebContainer.boot().then((wc) => {
    globalInstance = wc;
    return wc;
  });
  return bootPromise;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    getOrBootWebContainer()
      .then((wc) => {
        if (!mountedRef.current) return;
        setInstance(wc);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to initialize WebContainer:", err);
        if (!mountedRef.current) return;
        setError(
          err instanceof Error ? err.message : "Failed to initialize WebContainer"
        );
        setIsLoading(false);
      });

    return () => {
      // Do NOT teardown here — the singleton must survive re-renders.
      // Only mark as unmounted so stale setState calls are ignored.
      mountedRef.current = false;
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string): Promise<void> => {
      if (!instance) {
        throw new Error("WebContainer instance is not available");
      }
      try {
        const folderPath = path.split("/").slice(0, -1).join("/");
        if (folderPath) {
          await instance.fs.mkdir(folderPath, { recursive: true });
        }
        await instance.fs.writeFile(path, content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to write file";
        console.error(`Failed to write file at ${path}:`, err);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance]
  );

  const destroy = useCallback(() => {
    if (globalInstance) {
      globalInstance.teardown();
      globalInstance = null;
      bootPromise = null;
    }
    setInstance(null);
    setServerUrl(null);
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};
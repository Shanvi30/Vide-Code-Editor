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

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const mountedRef = useRef(true);
  const wcRef = useRef<WebContainer | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    // Agar pehle se instance hai toh naya boot mat karo
    if (wcRef.current) {
      setInstance(wcRef.current);
      setIsLoading(false);
      return;
    }

    WebContainer.boot()
      .then((wc) => {
        if (!mountedRef.current) {
          wc.teardown();
          return;
        }
        wcRef.current = wc;
        setInstance(wc);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to initialize WebContainer:", err);
        if (!mountedRef.current) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize WebContainer"
        );
        setIsLoading(false);
      });

    return () => {
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
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance]
  );

  const destroy = useCallback(() => {
    if (wcRef.current) {
      wcRef.current.teardown();
      wcRef.current = null;
    }
    setInstance(null);
    setServerUrl(null);
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};
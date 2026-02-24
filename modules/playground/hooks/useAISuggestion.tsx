import { useState, useCallback } from "react";

interface AISuggestionsState {
  suggestion: string | null;
  isLoading: boolean;
  position: { line: number; column: number } | null;
  decoration: string[];
  isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
  toggleEnabled: () => void;
  fetchSuggestion: (type: string, editor: any) => Promise<void>;
  acceptSuggestion: (editor: any, monaco: any) => void;
  rejectSuggestion: (editor: any) => void;
  clearSuggestion: (editor: any) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {
  const [state, setState] = useState<AISuggestionsState>({
    suggestion: null,
    isLoading: false,
    position: null,
    decoration: [],
    isEnabled: true,
  });

  const toggleEnabled = useCallback(() => {
    setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  const fetchSuggestion = useCallback(async (type: string, editor: any) => {
    if (!editor) return;

    const model = editor.getModel();
    const cursorPosition = editor.getPosition();
    if (!model || !cursorPosition) return;

    let shouldFetch = false;
    setState((currentState) => {
      shouldFetch = currentState.isEnabled && !currentState.isLoading;
      if (!shouldFetch) return currentState;
      return { ...currentState, isLoading: true };
    });

    if (!shouldFetch) return;

    try {
      const payload = {
        fileContent: model.getValue(),
        cursorLine: cursorPosition.lineNumber - 1,
        cursorColumn: cursorPosition.column - 1,
        suggestionType: type,
      };

      const response = await fetch("/api/code-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`AI suggestion skipped: API status ${response.status}`);
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const data = await response.json();

      if (data.suggestion) {
        setState((prev) => ({
          ...prev,
          suggestion: data.suggestion.trim(),
          position: {
            line: cursorPosition.lineNumber,
            column: cursorPosition.column,
          },
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.warn("AI suggestion unavailable:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // FIX: editor.executeEdits() moved OUTSIDE setState to avoid
  // "setState during render" React error
  const acceptSuggestion = useCallback((editor: any, monaco: any) => {
    setState((currentState) => {
      if (
        !currentState.suggestion ||
        !currentState.position ||
        !editor ||
        !monaco
      ) {
        return currentState;
      }

      const { line, column } = currentState.position;
      const sanitized = currentState.suggestion.replace(/^\d+:\s*/gm, "");

      // Schedule the editor mutation AFTER React finishes rendering
      setTimeout(() => {
        try {
          editor.executeEdits("", [
            {
              range: new monaco.Range(line, column, line, column),
              text: sanitized,
              forceMoveMarkers: true,
            },
          ]);
        } catch (e) {
          console.warn("executeEdits failed:", e);
        }

        if (currentState.decoration.length > 0) {
          try {
            editor.deltaDecorations(currentState.decoration, []);
          } catch (e) {
            console.warn("deltaDecorations failed:", e);
          }
        }
      }, 0);

      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  const rejectSuggestion = useCallback((editor: any) => {
    setState((currentState) => {
      if (editor && currentState.decoration.length > 0) {
        try {
          editor.deltaDecorations(currentState.decoration, []);
        } catch {}
      }
      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  const clearSuggestion = useCallback((editor: any) => {
    setState((currentState) => {
      if (editor && currentState.decoration.length > 0) {
        try {
          editor.deltaDecorations(currentState.decoration, []);
        } catch {}
      }
      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion,
  };
};

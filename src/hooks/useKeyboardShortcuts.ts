import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UseKeyboardShortcutsParams {
  onCommandPalette: () => void;
  onShortcutsModal: () => void;
  onSidebarToggle: () => void;
  onCreateContextual?: () => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts({
  onCommandPalette,
  onShortcutsModal,
  onSidebarToggle,
  onCreateContextual,
  onFocusSearch,
}: UseKeyboardShortcutsParams) {
  const navigate = useNavigate();

  useEffect(() => {
    let leaderTimeout: ReturnType<typeof setTimeout> | null = null;
    let leaderActive = false;

    const isInputFocused = () => {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (el as HTMLElement).isContentEditable
      );
    };

    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onCommandPalette();
        return;
      }
      if (meta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        onSidebarToggle();
        return;
      }
      if (meta && e.key === "/") {
        e.preventDefault();
        onShortcutsModal();
        return;
      }

      if (e.key === "Escape") return;

      if (isInputFocused()) return;

      if (e.key === "/" && !meta) {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }
      if (e.key === "c" && !meta && !leaderActive) {
        e.preventDefault();
        onCreateContextual?.();
        return;
      }

      if (e.key === "g" && !meta) {
        e.preventDefault();
        leaderActive = true;
        if (leaderTimeout) clearTimeout(leaderTimeout);
        leaderTimeout = setTimeout(() => {
          leaderActive = false;
        }, 1000);
        return;
      }
      if (leaderActive && !meta) {
        if (e.key === "d") {
          e.preventDefault();
          navigate("/");
          leaderActive = false;
          return;
        }
        if (e.key === "p") {
          e.preventDefault();
          navigate("/crm/pipeline");
          leaderActive = false;
          return;
        }
        if (e.key === "c") {
          e.preventDefault();
          navigate("/comercial/comissoes");
          leaderActive = false;
          return;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (leaderTimeout) clearTimeout(leaderTimeout);
    };
  }, [
    navigate,
    onCommandPalette,
    onShortcutsModal,
    onSidebarToggle,
    onCreateContextual,
    onFocusSearch,
  ]);
}
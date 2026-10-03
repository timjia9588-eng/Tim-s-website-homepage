import { useEffect, useRef } from "react";
const focusable =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]';
let scrollLocks = 0;
let originalOverflow = "";
export function useDialog(onClose: () => void, backgroundId: string) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const background = document.getElementById(backgroundId);
    const priorInert = background?.inert ?? false;
    if (scrollLocks === 0) originalOverflow = document.body.style.overflow;
    scrollLocks += 1;
    document.body.style.overflow = "hidden";
    if (background) background.inert = true;
    const frame = requestAnimationFrame(() => {
      (
        ref.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        ref.current
      )?.focus();
    });
    const handleKey = (event: KeyboardEvent) => {
      const dialogs = document.querySelectorAll("[data-dialog]");
      if (dialogs[dialogs.length - 1] !== ref.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const elements = [
        ...(ref.current?.querySelectorAll<HTMLElement>(focusable) ?? []),
      ].filter((el) => el.getClientRects().length && !el.closest("[inert]"));
      const first = elements[0];
      const last = elements.at(-1);
      if (!first) {
        event.preventDefault();
        ref.current?.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === ref.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey);
      scrollLocks -= 1;
      if (scrollLocks === 0) document.body.style.overflow = originalOverflow;
      if (background) background.inert = priorInert;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [backgroundId]);
  return ref;
}

"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

type FocusTrapOptions = {
  /** Element to focus when the trap activates. Defaults to the first focusable child. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Return focus to whatever was focused before the trap activated. Default: true. */
  restoreFocus?: boolean;
};

/**
 * Keeps Tab / Shift+Tab cycling inside `containerRef` while `active`,
 * and hands focus back to the opener when the trap releases.
 * The container should carry `tabIndex={-1}` so it can hold focus when it has no focusable children.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { initialFocusRef, restoreFocus = true }: FocusTrapOptions = {}
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]")
      );

    (initialFocusRef?.current ?? getFocusable()[0] ?? container).focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const outside = !container.contains(current);

      if (e.shiftKey && (current === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef, restoreFocus]);
}

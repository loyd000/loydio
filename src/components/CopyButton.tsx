"use client";
import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context / permissions); the mailto link still works.
    }
  };

  return (
    <button type="button" className="text-btn" onClick={copy} aria-live="polite">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

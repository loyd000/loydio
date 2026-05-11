"use client";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.style.cursor = "auto";
    return () => { document.documentElement.style.cursor = ""; };
  }, []);

  return <>{children}</>;
}

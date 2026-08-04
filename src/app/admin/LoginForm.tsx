"use client";
import { useActionState } from "react";
import { login } from "./actions";

const MONO = "var(--font-mono), monospace";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div style={{ fontFamily: MONO, minHeight: "100vh", background: "#fff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 360, padding: "0 2rem" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.25em", fontWeight: 700, marginBottom: "2.5rem" }}>
          ADMIN — LOYD.DEV
        </div>

        <form action={action}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", opacity: 0.45, marginBottom: 10 }}>
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              style={{ fontFamily: MONO, fontSize: 14, border: "none", borderBottom: "1px solid #000", padding: "8px 0", width: "100%", background: "none", outline: "none" }}
            />
          </div>

          {state?.error && (
            <div style={{ fontSize: 11, color: "red", marginBottom: "1rem", letterSpacing: "0.05em" }}>
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", border: "1px solid #000", padding: "12px 0", background: "#000", color: "#fff", cursor: "pointer", width: "100%" }}
          >
            {pending ? "..." : "ENTER"}
          </button>
        </form>
      </div>
    </div>
  );
}

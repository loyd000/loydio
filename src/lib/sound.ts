/**
 * Pure Web Audio API Sound Synthesizer
 * Zero external audio files, zero network latency, 0KB assets.
 * Generates tactile, muted, high-end micro-interaction sound effects.
 */

type SoundType =
  | "click"
  | "hover"
  | "morph"
  | "close"
  | "themeLight"
  | "themeDark"
  | "messageSend"
  | "messageReceive"
  | "pop"
  | "shadowball"
  | "shadowballImpact";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private lastHoverTime: number = 0;
  private lastHoverTarget: EventTarget | null = null;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("loyd_sound_enabled");
      // Default to sound enabled unless explicitly set to false
      this.isMuted = stored === "false";

      // Auto-unlock Web Audio API on the first user interaction gesture
      const handleUnlock = () => {
        this.unlock();
        window.removeEventListener("pointerdown", handleUnlock);
        window.removeEventListener("touchstart", handleUnlock);
        window.removeEventListener("keydown", handleUnlock);
        window.removeEventListener("click", handleUnlock);
      };

      window.addEventListener("pointerdown", handleUnlock, { passive: true });
      window.addEventListener("touchstart", handleUnlock, { passive: true });
      window.addEventListener("keydown", handleUnlock, { passive: true });
      window.addEventListener("click", handleUnlock, { passive: true });

      // Automatically initialize global interactive element listeners
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.initGlobalListeners());
      } else {
        setTimeout(() => this.initGlobalListeners(), 0);
      }
    }
  }

  public initGlobalListeners(): void {
    if (typeof window === "undefined" || this.initialized) return;
    this.initialized = true;

    const interactiveSelector = [
      "a",
      "button",
      "input[type='button']",
      "input[type='submit']",
      "[role='button']",
      ".btn",
      ".pill-link",
      ".skill-pill",
      ".stack-item",
      ".stack-card",
      ".bento-card",
      ".arc-card",
      ".design-carousel-card",
      ".photo-card",
      ".social-icon",
      ".social-link",
      ".chat-chip",
      ".chat-send-btn",
      ".pm-close",
      ".pm-arrow",
      ".liquid-glass-btn",
      ".liquid-glass-pill > *",
      ".cert-card",
      ".proj-card",
      "[data-sound='hover']",
    ].join(", ");

    document.addEventListener(
      "pointerover",
      (e: PointerEvent) => {
        if (this.isMuted) return;
        // Don't play hover on touch devices
        if (e.pointerType === "touch") return;

        const target = e.target as HTMLElement | null;
        if (!target) return;

        const interactiveEl = target.closest(interactiveSelector);
        if (!interactiveEl) return;

        if (interactiveEl === this.lastHoverTarget) return;

        const now = performance.now();
        // 35ms throttle for clean rhythmic ticks when sweeping over grids
        if (now - this.lastHoverTime < 35) return;

        this.lastHoverTime = now;
        this.lastHoverTarget = interactiveEl;

        this.play("hover");
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerout",
      (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest(interactiveSelector) === this.lastHoverTarget) {
          this.lastHoverTarget = null;
        }
      },
      { passive: true }
    );
  }

  public unlock(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("loyd_sound_enabled", (!muted).toString());
    }
    if (!muted) {
      this.unlock();
    }
    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  public toggleMute(): boolean {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    if (!nextMuted) {
      this.unlock();
      this.play("click");
    }
    return this.isMuted;
  }

  public subscribe(fn: (muted: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * Synthesize tactile UI sounds using oscillators, gain envelopes, and biquad filters.
   */
  public play(type: SoundType): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Auto resume if suspended
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      switch (type) {
        // ── Mechanical Tactile Click (Buttons, Links) ───────────────
        case "click": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(820, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.045);
          break;
        }

        // ── Micro Haptic Tick (Hover on links, cards, buttons) ────────
        case "hover": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.016);

          gain.gain.setValueAtTime(0.045, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.02);
          break;
        }

        // ── Resonant Glass Bloom (Navbar Long-press Morph) ───────────
        case "morph": {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(320, now);
          osc1.frequency.exponentialRampToValueAtTime(580, now + 0.09);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(640, now);
          osc2.frequency.exponentialRampToValueAtTime(1160, now + 0.09);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.21);
          osc2.stop(now + 0.21);
          break;
        }

        // ── Soft Damped Release (Close Chat / Close Modal) ───────────
        case "close": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        // ── Light Theme Chime (Ascending two-tone) ──────────────────
        case "themeLight": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.045); // E5

          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.17);
          break;
        }

        // ── Dark Theme Chime (Descending two-tone) ──────────────────
        case "themeDark": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(659.25, now); // E5
          osc.frequency.setValueAtTime(440.0, now + 0.045); // A4

          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.17);
          break;
        }

        // ── Message Send Blip ───────────────────────────────────────
        case "messageSend": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        // ── Message Receive Chime ───────────────────────────────────
        case "messageReceive": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(784, now); // G5
          osc.frequency.setValueAtTime(1046.5, now + 0.05); // C6

          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        // ── Glass Pop (Modal Open / Gengar Interaction) ──────────────
        case "pop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.045);

          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        // ── Gengar Shadow Ball Start (handled by Gengar cry audio) ──
        case "shadowball": {
          // Silent or micro subtle 8-bit charge chirp
          break;
        }

        // ── Retro 8-bit Pixel Game Impact ───────────────────────────
        case "shadowballImpact": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          // Authentic retro 8-bit square wave crunch
          osc.type = "square";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.setValueAtTime(220, now + 0.03);
          osc.frequency.setValueAtTime(120, now + 0.06);
          osc.frequency.setValueAtTime(50, now + 0.09);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }
      }
    } catch {
      // Gracefully silent if Web Audio is unsupported
    }
  }
}

export const sound = new SoundEngine();

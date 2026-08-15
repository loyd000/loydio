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
  | "pop";

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

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
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
    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    if (!this.isMuted) {
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

      const now = ctx.currentTime;

      switch (type) {
        // ── Mechanical Tactile Click (Buttons, Links) ───────────────
        case "click": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        // ── Micro Haptic Tick (Hover on links, cards, buttons) ────────
        case "hover": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.014);

          gain.gain.setValueAtTime(0.022, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.016);
          break;
        }

        // ── Resonant Glass Bloom (Navbar Long-press Morph) ───────────
        case "morph": {
          // Warm harmonic resonance
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(320, now);
          osc1.frequency.exponentialRampToValueAtTime(580, now + 0.09);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(640, now);
          osc2.frequency.exponentialRampToValueAtTime(1160, now + 0.09);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.19);
          osc2.stop(now + 0.19);
          break;
        }

        // ── Soft Damped Release (Close Chat / Close Modal) ───────────
        case "close": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        // ── Light Theme Chime (Ascending two-tone) ──────────────────
        case "themeLight": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.04); // E5

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        // ── Dark Theme Chime (Descending two-tone) ──────────────────
        case "themeDark": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(659.25, now); // E5
          osc.frequency.setValueAtTime(440.0, now + 0.04); // A4

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        // ── Message Send Blip ───────────────────────────────────────
        case "messageSend": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        // ── Message Receive Chime ───────────────────────────────────
        case "messageReceive": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(784, now); // G5
          osc.frequency.setValueAtTime(1046.5, now + 0.05); // C6

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }

        // ── Glass Pop (Modal Open) ──────────────────────────────────
        case "pop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(720, now + 0.04);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }
      }
    } catch {
      // Gracefully silent if Web Audio is unsupported
    }
  }
}

export const sound = new SoundEngine();

"use client";

// =============================================================================
// Web Audio API Synthesizer — High-tech micro-sound feedback
// =============================================================================

let audioCtx: AudioContext | null = null;
let isEnabled = true;

// Initialize on first user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Standard audio context
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    
    // Hydrate state
    const saved = localStorage.getItem("earthsphere-audio-enabled");
    if (saved !== null) {
      isEnabled = saved === "true";
    } else {
      isEnabled = true; // default enabled
      localStorage.setItem("earthsphere-audio-enabled", "true");
    }
  }
  return audioCtx;
}

export const audioSynth = {
  // Toggle state
  toggleMute(): boolean {
    isEnabled = !isEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("earthsphere-audio-enabled", isEnabled.toString());
    }
    return !isEnabled; // return true if muted to match old toggleMute return semantics
  },

  // Check if muted
  isMuted(): boolean {
    if (typeof window !== "undefined" && !audioCtx) {
      const saved = localStorage.getItem("earthsphere-audio-enabled");
      if (saved !== null) {
        isEnabled = saved === "true";
      }
    }
    return !isEnabled;
  },

  // Play hover sound (light high-frequency blip)
  playHover() {
    const ctx = getAudioContext();
    if (!ctx || !isEnabled) return;

    // Resume context if suspended (browser security)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // High pitch, light ping
      osc.frequency.setValueAtTime(1200, now);
      // Fast pitch decay for tech feel
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.04);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Failed to synthesize hover sound", e);
    }
  },

  // Play click sound (analog tech blip)
  playClick() {
    const ctx = getAudioContext();
    if (!ctx || !isEnabled) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Triangle waves have a softer, organic retro-tech tone
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn("Failed to synthesize click sound", e);
    }
  },

  // Play atmospheric rise on category selection
  playCategoryTransition() {
    const ctx = getAudioContext();
    if (!ctx || !isEnabled) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn("Failed to synthesize transition sound", e);
    }
  }
};

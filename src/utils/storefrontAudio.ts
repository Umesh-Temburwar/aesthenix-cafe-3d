// Procedural Web Audio synthesizer for the 3D Storefront sign assembly
// Generates whooshes, clicks, pops, thuds, glint chimes, and neon hum without external audio files

class StorefrontAudioController {
  private ctx: AudioContext | null = null;
  private neonGain: GainNode | null = null;
  private neonOsc: OscillatorNode | null = null;
  private neonSubOsc: OscillatorNode | null = null;
  private isEnabled: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.initCtx();
    } else {
      this.stopNeonHum();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // Whoosh sound when a 3D letter swoops in
  public playWhoosh() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // White noise buffer
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.3);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.35);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Click & thud when letter snaps into the facade
  public playClickThud() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sharp click transient
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(1400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      clickGain.gain.setValueAtTime(0.15, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // 2. Heavy physical impact thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(120, now);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

      thudGain.gain.setValueAtTime(0.28, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.18);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Shimmering chime sweep for the glint light sweep
  public playGlint() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const pitches = [1318.51, 1567.98, 2093.0, 2637.02]; // E6, G6, C7, E7

      pitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.45);
      });
    } catch {
      // Audio playback silently guarded
    }
  }

  // Warm 60Hz + 120Hz electrical neon hum
  public startNeonHum() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx || this.neonOsc) return;

    try {
      const now = this.ctx.currentTime;
      this.neonGain = this.ctx.createGain();
      this.neonGain.gain.setValueAtTime(0.001, now);
      this.neonGain.gain.linearRampToValueAtTime(0.05, now + 0.5);

      this.neonOsc = this.ctx.createOscillator();
      this.neonOsc.type = 'sine';
      this.neonOsc.frequency.setValueAtTime(60, now); // 60Hz mains hum

      this.neonSubOsc = this.ctx.createOscillator();
      this.neonSubOsc.type = 'sawtooth';
      this.neonSubOsc.frequency.setValueAtTime(120, now); // 120Hz harmonic

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.015, now);

      this.neonOsc.connect(this.neonGain);
      this.neonSubOsc.connect(subGain);
      subGain.connect(this.neonGain);
      this.neonGain.connect(this.ctx.destination);

      this.neonOsc.start(now);
      this.neonSubOsc.start(now);
    } catch {
      // Audio playback silently guarded
    }
  }

  public stopNeonHum() {
    try {
      if (this.neonGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.neonGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
      }
      setTimeout(() => {
        if (this.neonOsc) {
          try { this.neonOsc.stop(); } catch {}
          this.neonOsc.disconnect();
          this.neonOsc = null;
        }
        if (this.neonSubOsc) {
          try { this.neonSubOsc.stop(); } catch {}
          this.neonSubOsc.disconnect();
          this.neonSubOsc = null;
        }
        if (this.neonGain) {
          this.neonGain.disconnect();
          this.neonGain = null;
        }
      }, 350);
    } catch {
      // Audio playback silently guarded
    }
  }
}

export const storefrontAudio = new StorefrontAudioController();

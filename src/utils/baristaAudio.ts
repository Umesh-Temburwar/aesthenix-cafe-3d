// Procedural Web Audio synthesizer for the 3D Barista Extraction & Latte Art Simulator
// Zero external sound files — 100% real-time synthesized acoustics

class BaristaAudioController {
  private ctx: AudioContext | null = null;
  private pumpGain: GainNode | null = null;
  private pumpOsc: OscillatorNode | null = null;
  private pumpSubOsc: OscillatorNode | null = null;
  private streamGain: GainNode | null = null;
  private streamSource: AudioNode | null = null;
  private steamGain: GainNode | null = null;
  private steamSource: AudioNode | null = null;
  private isEnabled: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      this.stopPump();
      this.stopStream();
      this.stopSteam();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // Metallic portafilter lock sound
  public playPortafilterLock() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Rotary / Vibration espresso pump hum (50Hz hum with mechanical resonance)
  public startPump() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx || this.pumpOsc) return;

    try {
      const now = this.ctx.currentTime;
      this.pumpGain = this.ctx.createGain();
      this.pumpGain.gain.setValueAtTime(0.001, now);
      this.pumpGain.gain.linearRampToValueAtTime(0.08, now + 0.3);

      this.pumpOsc = this.ctx.createOscillator();
      this.pumpOsc.type = 'sawtooth';
      this.pumpOsc.frequency.setValueAtTime(55, now);

      this.pumpSubOsc = this.ctx.createOscillator();
      this.pumpSubOsc.type = 'sine';
      this.pumpSubOsc.frequency.setValueAtTime(110, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);

      this.pumpOsc.connect(filter);
      this.pumpSubOsc.connect(filter);
      filter.connect(this.pumpGain);
      this.pumpGain.connect(this.ctx.destination);

      this.pumpOsc.start(now);
      this.pumpSubOsc.start(now);
    } catch {
      // Audio playback silently guarded
    }
  }

  public stopPump() {
    try {
      if (this.pumpGain && this.ctx) {
        this.pumpGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      }
      setTimeout(() => {
        if (this.pumpOsc) {
          try { this.pumpOsc.stop(); } catch {}
          this.pumpOsc.disconnect();
          this.pumpOsc = null;
        }
        if (this.pumpSubOsc) {
          try { this.pumpSubOsc.stop(); } catch {}
          this.pumpSubOsc.disconnect();
          this.pumpSubOsc = null;
        }
        if (this.pumpGain) {
          this.pumpGain.disconnect();
          this.pumpGain = null;
        }
      }, 250);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Liquid stream trickle / espresso extraction hiss
  public startStream() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx || this.streamSource) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(1.8, now);

      this.streamGain = this.ctx.createGain();
      this.streamGain.gain.setValueAtTime(0.001, now);
      this.streamGain.gain.linearRampToValueAtTime(0.045, now + 0.4);

      noise.connect(filter);
      filter.connect(this.streamGain);
      this.streamGain.connect(this.ctx.destination);

      noise.start(now);
      this.streamSource = noise;
    } catch {
      // Audio playback silently guarded
    }
  }

  public stopStream() {
    try {
      if (this.streamGain && this.ctx) {
        this.streamGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      }
      setTimeout(() => {
        if (this.streamSource) {
          try { (this.streamSource as AudioBufferSourceNode).stop(); } catch {}
          this.streamSource.disconnect();
          this.streamSource = null;
        }
        if (this.streamGain) {
          this.streamGain.disconnect();
          this.streamGain = null;
        }
      }, 250);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Steam wand microfoam steaming hiss
  public startSteam() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx || this.steamSource) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2200, now);

      this.steamGain = this.ctx.createGain();
      this.steamGain.gain.setValueAtTime(0.001, now);
      this.steamGain.gain.linearRampToValueAtTime(0.06, now + 0.3);

      noise.connect(filter);
      filter.connect(this.steamGain);
      this.steamGain.connect(this.ctx.destination);

      noise.start(now);
      this.steamSource = noise;
    } catch {
      // Audio playback silently guarded
    }
  }

  public stopSteam() {
    try {
      if (this.steamGain && this.ctx) {
        this.steamGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      }
      setTimeout(() => {
        if (this.steamSource) {
          try { (this.steamSource as AudioBufferSourceNode).stop(); } catch {}
          this.steamSource.disconnect();
          this.steamSource = null;
        }
        if (this.steamGain) {
          this.steamGain.disconnect();
          this.steamGain = null;
        }
      }, 250);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Success chime (God Shot / Master Barista score)
  public playGodShotChime() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord arpeggio)
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.7);
      });
    } catch {
      // Audio playback silently guarded
    }
  }
}

export const baristaAudio = new BaristaAudioController();

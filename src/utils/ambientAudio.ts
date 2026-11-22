// Procedural Web Audio API Lo-Fi Café Ambiance Soundscape Synthesizer
// Zero external audio assets; real-time Rhodes chords, vinyl crackle, pink-noise room ambiance & café Foley

export type AmbientVibe = 'midnight-jazz' | 'tokyo-rain' | 'milan-roastery';

interface ChordVoicing {
  root: string;
  frequencies: number[]; // Frequencies in Hz
  duration: number; // in seconds
}

// Chord Voicings for Lo-Fi progressions
const VIBE_PROGRESSIONS: Record<AmbientVibe, ChordVoicing[]> = {
  'midnight-jazz': [
    // Dmaj9 -> Bm9 -> Em9 -> A13 (Warm late-night jazz roastery)
    { root: 'Dmaj9', frequencies: [146.83, 220.0, 277.18, 329.63, 440.0], duration: 4.5 },
    { root: 'Bm9', frequencies: [123.47, 185.0, 220.0, 293.66, 369.99], duration: 4.5 },
    { root: 'Em9', frequencies: [164.81, 196.0, 246.94, 293.66, 369.99], duration: 4.5 },
    { root: 'A13', frequencies: [110.0, 164.81, 220.0, 277.18, 369.99], duration: 4.5 },
  ],
  'tokyo-rain': [
    // Fmaj9 -> Em7 -> Dm9 -> Cmaj7 (Reflective rainy Shibuya coffee sanctuary)
    { root: 'Fmaj9', frequencies: [174.61, 220.0, 261.63, 329.63, 392.0], duration: 5.0 },
    { root: 'Em7', frequencies: [164.81, 196.0, 246.94, 293.66, 392.0], duration: 5.0 },
    { root: 'Dm9', frequencies: [146.83, 174.61, 220.0, 261.63, 329.63], duration: 5.0 },
    { root: 'Cmaj7', frequencies: [130.81, 196.0, 246.94, 261.63, 329.63], duration: 5.0 },
  ],
  'milan-roastery': [
    // Gmaj9 -> E7b9 -> Am9 -> D9 (Vibrant afternoon espresso bar)
    { root: 'Gmaj9', frequencies: [196.0, 246.94, 293.66, 369.99, 440.0], duration: 3.8 },
    { root: 'E7b9', frequencies: [164.81, 207.65, 246.94, 293.66, 349.23], duration: 3.8 },
    { root: 'Am9', frequencies: [220.0, 261.63, 329.63, 392.0, 493.88], duration: 3.8 },
    { root: 'D9', frequencies: [146.83, 220.0, 277.18, 329.63, 440.0], duration: 3.8 },
  ],
};

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isRunning: boolean = false;
  private volume: number = 0.35;
  private vibe: AmbientVibe = 'midnight-jazz';

  // Lo-Fi Subsystems
  private chordTimer: number | null = null;
  private chordIndex: number = 0;
  private roomNoiseNode: AudioBufferSourceNode | null = null;
  private roomGainNode: GainNode | null = null;
  private vinylGainNode: GainNode | null = null;
  private foleyInterval: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVibe(newVibe: AmbientVibe) {
    this.vibe = newVibe;
    this.chordIndex = 0;
    if (this.isRunning) {
      this.stopChordLoop();
      this.startChordLoop();
    }
  }

  public getVibe(): AmbientVibe {
    return this.vibe;
  }

  public start() {
    if (this.isRunning) return;
    this.initContext();
    if (!this.ctx) return;

    this.isRunning = true;
    this.startRoomAmbiance();
    this.startVinylCrackle();
    this.startChordLoop();
    this.startPeriodicFoley();
  }

  public stop() {
    this.isRunning = false;
    this.stopChordLoop();
    this.stopRoomAmbiance();
    this.stopPeriodicFoley();
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getFrequencyData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  // ================= 1. RHODES ELECTRIC PIANO CHORD SYNTHESIS =================
  private playRhodesNote(frequency: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    try {
      // 1. Primary Tine Oscillator (Warm Sine)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, startTime);

      // 2. Harmonic Overtone (Triangle wave for vintage bell-like sparkle)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2, startTime);

      // 3. Subtle Chorus / Tremolo LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(4.2, startTime); // 4.2Hz tremolo
      lfoGain.gain.setValueAtTime(2.5, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + duration + 0.8);

      // 4. Low-pass Filter for vintage warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1050, startTime);
      filter.frequency.exponentialRampToValueAtTime(650, startTime + duration);
      filter.Q.setValueAtTime(1.1, startTime);

      // 5. Volume Envelope (Gentle touch attack, long mellow release)
      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.12, startTime + 0.08); // Soft attack
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.8);

      // Harmonic mix
      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.025, startTime);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc1.connect(noteGain);
      osc2.connect(overtoneGain);
      overtoneGain.connect(noteGain);

      noteGain.connect(filter);
      filter.connect(this.masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.8);
      osc2.stop(startTime + duration + 0.8);
    } catch {
      // Audio node silently guarded
    }
  }

  private triggerCurrentChord() {
    if (!this.ctx || !this.isRunning) return;

    const progression = VIBE_PROGRESSIONS[this.vibe];
    const currentChord = progression[this.chordIndex];
    const now = this.ctx.currentTime;

    // Slight strum arpeggio timing (human touch 15ms per note)
    currentChord.frequencies.forEach((freq, idx) => {
      const noteDelay = idx * 0.018;
      this.playRhodesNote(freq, now + noteDelay, currentChord.duration);
    });

    this.chordIndex = (this.chordIndex + 1) % progression.length;
  }

  private startChordLoop() {
    this.stopChordLoop();
    this.triggerCurrentChord();

    const scheduleNext = () => {
      if (!this.isRunning) return;
      const progression = VIBE_PROGRESSIONS[this.vibe];
      const prevChord = progression[(this.chordIndex - 1 + progression.length) % progression.length];
      const nextDelayMs = (prevChord.duration - 0.2) * 1000;

      this.chordTimer = window.setTimeout(() => {
        this.triggerCurrentChord();
        scheduleNext();
      }, nextDelayMs);
    };

    scheduleNext();
  }

  private stopChordLoop() {
    if (this.chordTimer) {
      clearTimeout(this.chordTimer);
      this.chordTimer = null;
    }
  }

  // ================= 2. ROOM AMBIANCE (PINK NOISE SANCTUARY WARMTH) =================
  private startRoomAmbiance() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // 3-second looping pink noise buffer
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
          b6 = white * 0.115926;
        }
      }

      this.roomNoiseNode = this.ctx.createBufferSource();
      this.roomNoiseNode.buffer = buffer;
      this.roomNoiseNode.loop = true;

      // Bandpass filter to isolate warm café murmur presence
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(this.vibe === 'tokyo-rain' ? 850 : 420, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(0.8, this.ctx.currentTime);

      this.roomGainNode = this.ctx.createGain();
      this.roomGainNode.gain.setValueAtTime(0.045, this.ctx.currentTime);

      this.roomNoiseNode.connect(bandpass);
      bandpass.connect(this.roomGainNode);
      this.roomGainNode.connect(this.masterGain);

      this.roomNoiseNode.start();
    } catch {
      // Room node silently guarded
    }
  }

  private stopRoomAmbiance() {
    try {
      if (this.roomNoiseNode) {
        this.roomNoiseNode.stop();
        this.roomNoiseNode.disconnect();
        this.roomNoiseNode = null;
      }
      if (this.roomGainNode) {
        this.roomGainNode.disconnect();
        this.roomGainNode = null;
      }
    } catch {}
  }

  // ================= 3. RETRO VINYL SURFACE CRACKLE =================
  private startVinylCrackle() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // Generates subtle random needle crackle impulses
      const crackleSize = this.ctx.sampleRate * 2;
      const crackleBuffer = this.ctx.createBuffer(1, crackleSize, this.ctx.sampleRate);
      const data = crackleBuffer.getChannelData(0);

      for (let i = 0; i < crackleSize; i++) {
        // Sparse random clicks
        if (Math.random() < 0.0018) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        } else {
          data[i] = 0;
        }
      }

      const vinylNode = this.ctx.createBufferSource();
      vinylNode.buffer = crackleBuffer;
      vinylNode.loop = true;

      const hpFilter = this.ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);

      this.vinylGainNode = this.ctx.createGain();
      this.vinylGainNode.gain.setValueAtTime(0.015, this.ctx.currentTime);

      vinylNode.connect(hpFilter);
      hpFilter.connect(this.vinylGainNode);
      this.vinylGainNode.connect(this.masterGain);

      vinylNode.start();
    } catch {
      // Vinyl node guarded
    }
  }

  // ================= 4. PERIODIC CAFÉ FOLEY (STEAM WAND & CUP CLINK) =================
  private startPeriodicFoley() {
    this.stopPeriodicFoley();

    this.foleyInterval = window.setInterval(() => {
      if (!this.isRunning || !this.ctx) return;
      const roll = Math.random();
      if (roll < 0.45) {
        this.triggerSteamWandHiss();
      } else if (roll < 0.85) {
        this.triggerCupClink();
      }
    }, 14000); // Trigger acoustic event every ~14s
  }

  private stopPeriodicFoley() {
    if (this.foleyInterval) {
      clearInterval(this.foleyInterval);
      this.foleyInterval = null;
    }
  }

  private triggerSteamWandHiss() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const dur = 1.2;
      const bufSize = this.ctx.sampleRate * dur;
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const f = this.ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(3200, now);
      f.Q.setValueAtTime(2.5, now);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.025, now + 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      src.connect(f);
      f.connect(g);
      g.connect(this.masterGain);

      src.start(now);
      src.stop(now + dur);
    } catch {}
  }

  private triggerCupClink() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2349.32, now); // D7 glass/ceramic chime
      osc.frequency.exponentialRampToValueAtTime(2100, now + 0.18);

      g.gain.setValueAtTime(0.02, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(g);
      g.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }
}

export const ambientAudio = new AmbientAudioEngine();

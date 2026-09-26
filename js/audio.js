/**
 * Celestial Judgment - Web Audio API Procedural Sound Engine
 * Synthesizes all sound effects, judgment verdicts, and the Angel sequence.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.masterGain = null;
    this.musicGain = null;
    this.volume = 0.45;          // SFX volume
    this.musicVolume = 0.20;     // Menu music volume: subtle, atmospheric, quieter than SFX

    // Decoded Web Audio Buffers
    this.buffers = {};
    // Preloaded HTML5 Audio Elements (universal instant fallback)
    this.audioElements = {};

    this.soundPaths = {
      menu: ["menu.mp3", "audio/menu.mp3"],
      heaven: ["heaven.mp3", "audio/heaven.mp3"],
      hell: ["hell.mp3", "audio/hell.mp3"],
      final: ["final.mp3", "audio/final.mp3"]
    };

    // Track active music
    this.musicSource = null;
    this.isMusicPlaying = false;
    this.musicFadeTimeout = null;

    this.initPreloadElements();
  }

  initPreloadElements() {
    try {
      if (typeof window !== "undefined" && typeof Audio !== "undefined") {
        for (const [key, paths] of Object.entries(this.soundPaths)) {
          const audio = new Audio();
          audio.preload = "auto";
          audio.src = paths[0];
          audio.volume = (key === "menu") ? this.musicVolume : this.volume;
          if (key === "menu") {
            audio.loop = true;
          }
          audio.load();
          this.audioElements[key] = audio;
        }
      }
    } catch (e) {
      console.warn("Audio element preloading warning:", e);
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    const activeMusicVol = (this.enabled && this.musicEnabled) ? this.musicVolume : 0;
    this.musicGain.gain.setValueAtTime(activeMusicVol, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.preloadWebAudioBuffers();
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  async preloadWebAudioBuffers() {
    if (!this.ctx) return;
    for (const [key, paths] of Object.entries(this.soundPaths)) {
      if (this.buffers[key]) continue;
      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const arr = await res.arrayBuffer();
            this.buffers[key] = await this.ctx.decodeAudioData(arr);
            break;
          }
        } catch (e) {
          // If fetch fails (e.g. CORS on file://), audioElements fallback handles playback
        }
      }
    }
  }

  toggle(isInMenu = false) {
    this.enabled = !this.enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime);
    }
    if (!this.enabled) {
      for (const key of Object.keys(this.audioElements)) {
        const a = this.audioElements[key];
        if (a && !a.paused) {
          a.pause();
          if (key !== "menu") a.currentTime = 0;
        }
      }
      if (this.musicSource) {
        try { this.musicSource.stop(); } catch (e) {}
        this.musicSource = null;
        this.isMusicPlaying = false;
      }
    } else {
      if (isInMenu && this.musicEnabled) {
        this.playMenuMusic();
      }
    }
    return this.enabled;
  }

  toggleMusic(isInMenu = false) {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime((this.enabled && this.musicEnabled) ? this.musicVolume : 0, this.ctx.currentTime);
    }
    if (!this.musicEnabled) {
      this.fadeAndStopMenuMusic(200);
    } else {
      if (isInMenu && this.enabled) {
        this.playMenuMusic();
      }
    }
    return this.musicEnabled;
  }

  playMenuMusic() {
    if (!this.enabled || !this.musicEnabled) return;
    if (this.isMusicPlaying) return; // Single playback instance; does not restart across menu navigation

    this.ensureContext();

    if (this.musicFadeTimeout) {
      clearTimeout(this.musicFadeTimeout);
      this.musicFadeTimeout = null;
    }

    // 1. Web Audio API looping source
    if (this.ctx && this.buffers["menu"]) {
      try {
        if (this.musicSource) {
          try { this.musicSource.stop(); } catch (e) {}
          this.musicSource = null;
        }

        const src = this.ctx.createBufferSource();
        src.buffer = this.buffers["menu"];
        src.loop = true;

        const now = this.ctx.currentTime;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0, now);
        this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, now + 0.35);

        src.connect(this.musicGain);
        src.start(0);

        this.musicSource = src;
        this.isMusicPlaying = true;
        return true;
      } catch (err) {
        console.warn("WebAudio menu music playback failed:", err);
      }
    }

    // 2. Preloaded HTML5 Audio element fallback
    let audio = this.audioElements["menu"] || document.getElementById("bgm-menu");
    if (audio) {
      try {
        audio.loop = true;
        audio.volume = (this.enabled && this.musicEnabled) ? this.musicVolume : 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isMusicPlaying = true;
          }).catch(() => {
            // Browser autoplay restrictions: start upon first user tap
            const onGesture = () => {
              if (this.enabled && this.musicEnabled && !this.isMusicPlaying) {
                audio.play().then(() => {
                  this.isMusicPlaying = true;
                }).catch(() => {});
              }
              window.removeEventListener("pointerdown", onGesture);
              window.removeEventListener("keydown", onGesture);
            };
            window.addEventListener("pointerdown", onGesture);
            window.addEventListener("keydown", onGesture);
          });
        }
        return true;
      } catch (err) {
        console.warn("HTML5 Audio menu music playback failed:", err);
      }
    }
    return false;
  }

  fadeAndStopMenuMusic(durationMs = 400) {
    if (!this.isMusicPlaying) return;
    this.isMusicPlaying = false;

    // Web Audio smooth fade out
    if (this.ctx && this.musicGain && this.musicSource) {
      try {
        const now = this.ctx.currentTime;
        const durSec = durationMs / 1000;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0.0001, now + durSec);

        this.musicFadeTimeout = setTimeout(() => {
          if (this.musicSource) {
            try { this.musicSource.stop(); } catch (e) {}
            this.musicSource = null;
          }
          if (this.musicGain && this.ctx) {
            this.musicGain.gain.setValueAtTime((this.enabled && this.musicEnabled) ? this.musicVolume : 0, this.ctx.currentTime);
          }
          this.musicFadeTimeout = null;
        }, durationMs + 20);
      } catch (err) {
        console.warn("WebAudio fade out error:", err);
      }
    }

    // HTML5 Audio fade out fallback
    let audio = this.audioElements["menu"] || document.getElementById("bgm-menu");
    if (audio && !audio.paused) {
      const stepInterval = 40;
      const steps = Math.max(1, Math.floor(durationMs / stepInterval));
      const volStep = audio.volume / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps || audio.volume <= volStep) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.currentTime = 0;
          audio.volume = this.musicVolume;
        } else {
          audio.volume = Math.max(0, audio.volume - volStep);
        }
      }, stepInterval);
    }
  }

  playSoundFile(name, fallbackFn = null) {
    if (!this.enabled) return;
    this.ensureContext();

    // 1. Try Web Audio buffer source first (exact sync with masterGain & zero latency)
    if (this.ctx && this.buffers[name]) {
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = this.buffers[name];
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        src.connect(gain);
        gain.connect(this.masterGain);
        src.start(0);
        return true;
      } catch (err) {
        console.warn(`WebAudio buffer play failed for ${name}:`, err);
      }
    }

    // 2. Try preloaded HTML5 Audio element fallback
    let audio = this.audioElements[name];
    if (!audio && typeof document !== "undefined") {
      audio = document.getElementById(`sfx-${name}`);
    }
    if (audio) {
      try {
        audio.volume = this.enabled ? this.volume : 0;
        audio.currentTime = 0;
        const p = audio.play();
        if (p !== undefined) {
          p.catch(() => {
            if (fallbackFn) fallbackFn();
          });
        }
        return true;
      } catch (err) {
        console.warn(`HTML5 Audio play failed for ${name}:`, err);
      }
    }

    // 3. Fallback to procedural synthesis if audio file cannot be played
    if (fallbackFn) {
      fallbackFn();
      return true;
    }
    return false;
  }

  playHover() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playSoulEnter() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Ethereal sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.26);

    // Impact thud
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(140, now + 0.22);
    thud.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    thudGain.gain.setValueAtTime(0.35, now + 0.22);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    thud.connect(thudGain);
    thudGain.connect(this.masterGain);
    thud.start(now + 0.22);
    thud.stop(now + 0.4);
  }

  playHeaven() {
    if (!this.enabled) return;
    this.playSoundFile("heaven", () => this.playSynthHeaven());
  }

  playSynthHeaven() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.01, startTime + 0.7);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(261.63, now);
    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(now);
    sub.stop(now + 0.9);
  }

  playHell() {
    if (!this.enabled) return;
    this.playSoundFile("hell", () => this.playSynthHell());
  }

  playSynthHell() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(35, now + 0.7);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(90, now + 0.7);

    sub.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.masterGain);

    sub.start(now);
    sub.stop(now + 0.7);

    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(500, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.5);
  }

  playTick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playUrgentTick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playCorrect() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [659.25, 880]; // E5 -> A5 crisp chime
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  }

  playLifeLost() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Discordant shock strike
    const freqs = [370, 311, 220]; // Dissonant tritone
    freqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.35);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.42);
    });
  }

  playTimeout() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(100, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playStreak() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  playAngelIntro() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Resonant deep drone C2 & G2
    const droneFreqs = [65.41, 98.0, 196.0];
    droneFreqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.0);
    });

    // High ethereal chime
    const highOsc = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    highOsc.type = 'triangle';
    highOsc.frequency.setValueAtTime(1046.5, now + 0.4); // C6
    highGain.gain.setValueAtTime(0, now + 0.4);
    highGain.gain.linearRampToValueAtTime(0.15, now + 0.6);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    highOsc.connect(highGain);
    highGain.connect(this.masterGain);
    highOsc.start(now + 0.4);
    highOsc.stop(now + 2.5);
  }

  playFinal() {
    if (!this.enabled) return;
    this.playSoundFile("final", () => this.playSynthAngelVerdict(true));
  }

  playAngelVerdict(isHeaven) {
    if (!this.enabled) return;
    this.playFinal();
  }

  playSynthAngelVerdict(isHeaven) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    if (isHeaven) {
      this.playSynthHeaven();
      setTimeout(() => this.playStreak(), 200);
    } else {
      this.playSynthHell();
    }
  }

  playAbility() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.35);
    });
  }

  playTimeFreeze() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [880, 1174.66, 1760];
    freqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.5);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.85);
    });
  }
}

window.soundEngine = new SoundEngine();

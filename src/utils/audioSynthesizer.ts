/**
 * Audio Synthesizer for SENA Hymn Melodic Experience
 * Uses standard Web Audio API to play an uplifting institutional brass/chime fanfare melody
 * without external audio dependencies that could fail.
 */

class SenaAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timeouts: number[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playHymnFanfare(onProgress?: (progress: number) => void, onComplete?: () => void) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Harmonious triumphant institutional melody (C major / G major uplifting progression)
    // Notes corresponding to "Estudiantes del SENA ¡adelante! Por Colombia luchad con amor..."
    const notes = [
      { f: 261.63, d: 0.45 }, // C4
      { f: 329.63, d: 0.45 }, // E4
      { f: 392.00, d: 0.60 }, // G4
      { f: 523.25, d: 0.90 }, // C5
      { f: 493.88, d: 0.45 }, // B4
      { f: 440.00, d: 0.45 }, // A4
      { f: 392.00, d: 0.80 }, // G4
      { f: 349.23, d: 0.45 }, // F4
      { f: 329.63, d: 0.45 }, // E4
      { f: 293.66, d: 0.60 }, // D4
      { f: 261.63, d: 1.20 }, // C4
      // Second phrase
      { f: 392.00, d: 0.45 }, // G4
      { f: 440.00, d: 0.45 }, // A4
      { f: 523.25, d: 0.60 }, // C5
      { f: 587.33, d: 0.90 }, // D5
      { f: 523.25, d: 1.40 }, // C5
    ];

    let currentOffset = 0.1;
    const totalDuration = notes.reduce((sum, n) => sum + n.d, 0) + 0.5;

    notes.forEach((note, idx) => {
      const startTime = now + currentOffset;
      const duration = note.d;

      // Primary tone
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(note.f, startTime);

      // Warm attack and gentle decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);

      // Harmony layer (third above or octave below)
      const subOsc = this.ctx!.createOscillator();
      const subGain = this.ctx!.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(note.f * 0.5, startTime);
      subGain.gain.setValueAtTime(0.001, startTime);
      subGain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      subOsc.connect(subGain);
      subGain.connect(this.ctx!.destination);
      subOsc.start(startTime);
      subOsc.stop(startTime + duration);

      currentOffset += duration;
    });

    // Track visual progress
    const intervalTime = 100;
    const totalSteps = (totalDuration * 1000) / intervalTime;
    let step = 0;

    const interval = window.setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(interval);
        return;
      }
      step++;
      const pct = Math.min(100, Math.round((step / totalSteps) * 100));
      onProgress?.(pct);
      if (pct >= 100) {
        clearInterval(interval);
        this.isPlaying = false;
        onComplete?.();
      }
    }, intervalTime);

    this.timeouts.push(interval);
  }

  public playSuccessTone() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  public stop() {
    this.isPlaying = false;
    this.timeouts.forEach(t => clearInterval(t));
    this.timeouts = [];
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const senaAudio = new SenaAudioPlayer();

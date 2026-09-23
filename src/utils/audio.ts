/**
 * Web Audio API romantic wedding melody player.
 * Plays a gentle, nostalgic piano / celesta progression (D Major - Canon in D inspired)
 * without relying on external MP3 URLs that may break or have CORS issues.
 */

class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private noteIndex: number = 0;

  // Gentle melody note frequencies (Canon in D arpeggios & romantic harmonies)
  // D4, F#4, A4, D5, A3, C#4, E4, A4, B3, D4, F#4, B4, F#3, A3, C#4, F#4, G3, B3, D4, G4, D3, F#3, A3, D4, G3, B3, D4, G4, A3, C#4, E4, A4
  private sequence: number[] = [
    293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
    220.00, 277.18, 329.63, 440.00, 329.63, 277.18,
    246.94, 293.66, 369.99, 493.88, 369.99, 293.66,
    185.00, 220.00, 277.18, 369.99, 277.18, 220.00,
    196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
    146.83, 220.00, 293.66, 369.99, 293.66, 220.00,
    196.00, 246.94, 293.66, 392.00, 493.88, 587.33,
    220.00, 277.18, 329.63, 440.00, 554.37, 659.25,
  ];

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.scheduleNextNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  private playTone(freq: number) {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Gentle soft sine & triangle mixture for warm acoustic feel
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying) return;

    const freq = this.sequence[this.noteIndex % this.sequence.length];
    this.playTone(freq);

    this.noteIndex++;
    // Arpeggio note spacing ~ 420ms
    this.timer = window.setTimeout(this.scheduleNextNote, 420);
  };
}

export const weddingAudio = new WeddingAudioPlayer();

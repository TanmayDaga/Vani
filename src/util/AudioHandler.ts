import { VOICE_OPTIONS } from "./constant";

import Cartesia, { Source, WebPlayer } from "@cartesia/cartesia-js";

export class AudioHandler {
  private static instance: AudioHandler | null = null;
  private voice: VOICE_OPTIONS;
  private audioContext: AudioContext;
  private audio: HTMLAudioElement;
  private webPlayer: WebPlayer;
  private webPlayerSource: Source;

  private constructor(voice: VOICE_OPTIONS) {
    this.voice = voice;

    this.audioContext = new window.AudioContext();
    this.audio = new Audio();
    this.webPlayer = new WebPlayer({ bufferDuration: 1000 });
    this.webPlayerSource = new Source({
      sampleRate: 44100,
      encoding: "pcm_f32le",
      container: "raw",
    });
    this.webPlayer.play(this.webPlayerSource);
  }

  public static getInstance(voice: VOICE_OPTIONS): AudioHandler {
    if (!AudioHandler.instance) {
      AudioHandler.instance = new AudioHandler(voice);
    }
    return AudioHandler.instance;
  }

  public async playSound(audioBinary: ArrayBuffer) {
    switch (this.voice) {
      case "Deepgram": {
        const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio.pause();
        this.audio.src = audioUrl;
        this.audio.onpause = () => {
          URL.revokeObjectURL(audioUrl);
        };
        this.audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
        this.audio.oncancel = () => {
          URL.revokeObjectURL(audioUrl);
        };
        try {
          await this.audio.play();
        } catch (error) {
          console.error("Error playing audio:", error);
        }

        break;
      }
      case "Cartesia": {
        // this.audioContext.close();

        // const float32Array = new Float32Array(audioBinary);
        // const audioBuffer = this.audioContext.createBuffer(
        //   1,
        //   float32Array.length,
        //   44100
        // );
        // audioBuffer.copyToChannel(float32Array, 0);

        // const bufferSource = this.audioContext.createBufferSource();
        // bufferSource.buffer = audioBuffer;
        // bufferSource.connect(this.audioContext.destination);

        // bufferSource.start();
        // bufferSource.onended = () => {
        //   this.audioContext.close();
        // };
        this.webPlayerSource.enqueue(new Float32Array(audioBinary));
        this.webPlayer.resume()

        break;
      }
    }
  }

  public pauseAudio() {
    switch (this.voice) {
      case "Deepgram":
        this.audio.pause();
        break;
      case "Cartesia":
        this.audioContext.close();
        break;
    }
  }
  // Add additional methods as needed
}

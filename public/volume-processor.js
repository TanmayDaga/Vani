class AudioLevelProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.lastUpdate = 0;
    this.volume = 0;
    console.log("I am loaded2");
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const samples = input[0];
      let sum = 0;

      for (let i = 0; i < samples.length; i++) {
        sum += samples[i] * samples[i];
        output[0][i] = samples[i]; // Copy input to output
      }

      const rms = Math.sqrt(sum / samples.length);
      this.volume = Math.max(rms, this.volume * 0.95);

      if (currentTime - this.lastUpdate > 0.1) {
        this.lastUpdate = currentTime;
        const db = 20 * Math.log10(this.volume);
        let aboveThreshold = db > -15;
        this.port.postMessage({
          level: db,
          aboveThreshold: aboveThreshold,
          processedAudio: inputs, // Send processed audio data
        });
      }
    }

    return true;
  }
}

registerProcessor("volume-processor", AudioLevelProcessor);

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sampleRate = 44100;
const channels = 2;
const durationSeconds = 22;
const totalFrames = Math.floor(sampleRate * durationSeconds);
const samples = new Float32Array(totalFrames * channels);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (() => {
  let seed = 1773;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967295;
  };
})();

const addSample = (index, value, pan = 0) => {
  if (index < 0 || index >= totalFrames) return;
  const left = Math.cos(((pan + 1) * Math.PI) / 4);
  const right = Math.sin(((pan + 1) * Math.PI) / 4);
  samples[index * 2] += value * left;
  samples[index * 2 + 1] += value * right;
};

const addKick = (time, volume = 0.95) => {
  const start = Math.floor(time * sampleRate);
  const length = Math.floor(0.28 * sampleRate);
  let phase = 0;

  for (let i = 0; i < length; i += 1) {
    const t = i / length;
    const freq = 132 * Math.pow(42 / 132, t);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.exp(-8.5 * t);
    const thump = Math.sin(phase) * env * volume;
    addSample(start + i, thump, 0);
  }
};

const addClap = (time, volume = 0.42) => {
  const start = Math.floor(time * sampleRate);
  const length = Math.floor(0.16 * sampleRate);

  for (let i = 0; i < length; i += 1) {
    const t = i / length;
    const burst = i < length * 0.16 || (i > length * 0.28 && i < length * 0.46) ? 1 : 0.55;
    const env = Math.pow(1 - t, 2.3) * burst;
    const noise = (rand() * 2 - 1) * env * volume;
    addSample(start + i, noise, 0.12);
  }
};

const addHat = (time, volume = 0.12) => {
  const start = Math.floor(time * sampleRate);
  const length = Math.floor(0.052 * sampleRate);
  let last = 0;

  for (let i = 0; i < length; i += 1) {
    const t = i / length;
    const noise = rand() * 2 - 1;
    const high = noise - last * 0.74;
    last = noise;
    addSample(start + i, high * Math.pow(1 - t, 1.8) * volume, i % 2 ? 0.42 : -0.42);
  }
};

const addRiser = (startTime, endTime, volume = 0.26) => {
  const start = Math.floor(startTime * sampleRate);
  const length = Math.floor((endTime - startTime) * sampleRate);
  let phase = 0;

  for (let i = 0; i < length; i += 1) {
    const t = i / length;
    const freq = 260 + 820 * t * t;
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.pow(t, 1.7);
    const tone = Math.sin(phase) * 0.38;
    const hiss = (rand() * 2 - 1) * 0.62;
    addSample(start + i, (tone + hiss) * env * volume, Math.sin(t * Math.PI * 2) * 0.45);
  }
};

const addImpact = (time, volume = 0.7) => {
  const start = Math.floor(time * sampleRate);
  const length = Math.floor(0.45 * sampleRate);
  let phase = 0;

  for (let i = 0; i < length; i += 1) {
    const t = i / length;
    const freq = 94 - 54 * t;
    phase += (2 * Math.PI * freq) / sampleRate;
    const boom = Math.sin(phase) * Math.exp(-5.2 * t);
    const air = (rand() * 2 - 1) * Math.exp(-7 * t);
    addSample(start + i, (boom * 0.75 + air * 0.25) * volume, 0);
  }
};

const addCrowdRush = () => {
  const length = Math.floor(3.1 * sampleRate);
  let low = 0;

  for (let i = 0; i < length; i += 1) {
    const seconds = i / sampleRate;
    const amp = seconds < 2.35 ? 0.11 : 0.11 * (1 - (seconds - 2.35) / 0.75);
    low = low * 0.985 + (rand() * 2 - 1) * 0.015;
    const chatter = low + (rand() * 2 - 1) * 0.11;
    addSample(i, chatter * clamp(amp, 0, 0.11), Math.sin(seconds * 3.2) * 0.35);
  }
};

for (let t = 0; t < durationSeconds; t += 0.25) {
  addHat(t, t < 3 ? 0.16 : 0.11);
}

for (let t = 0; t < durationSeconds; t += 0.5) {
  if (Math.round(t * 2) % 2 === 0) {
    addKick(t, t < 2 ? 1.05 : 0.82);
  } else {
    addClap(t, 0.34);
  }
}

[0, 0.67, 1.33, 2, 3, 6, 10, 14, 18].forEach((time, index) => {
  addImpact(time, index < 4 ? 0.46 : 0.74);
});

[
  [2.35, 3],
  [5.35, 6],
  [9.25, 10],
  [13.25, 14],
  [17.25, 18],
].forEach(([start, end]) => addRiser(start, end));

addCrowdRush();

let peak = 0;
for (let i = 0; i < samples.length; i += 1) {
  peak = Math.max(peak, Math.abs(samples[i]));
}

const gain = peak > 0 ? 0.92 / peak : 1;
for (let i = 0; i < samples.length; i += 1) {
  samples[i] = Math.tanh(samples[i] * gain * 1.18);
}

const bytesPerSample = 2;
const dataSize = samples.length * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
buffer.writeUInt16LE(channels * bytesPerSample, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

for (let i = 0; i < samples.length; i += 1) {
  const value = Math.round(clamp(samples[i], -1, 1) * 32767);
  buffer.writeInt16LE(value, 44 + i * bytesPerSample);
}

const outputPath = resolve("public/audio/boutique-reel-bed.wav");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, buffer);

console.log(`Generated ${outputPath}`);

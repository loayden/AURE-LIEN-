import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "audio", "drape");
mkdirSync(outDir, { recursive: true });

const sampleRate = 48000;
const seconds = 75;
const channels = 2;
const samples = sampleRate * seconds;
const mix = new Float32Array(samples * channels);

const notes = { D3: 146.83, A3: 220, D4: 293.66, FS4: 369.99, A4: 440, E5: 659.25 };
const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (from, to, value) => {
  const x = clamp((value - from) / (to - from));
  return x * x * (3 - 2 * x);
};
const env = (time, start, end, attack = 0.2, release = 0.3) => {
  if (time < start || time > end) return 0;
  return Math.min(smooth(start, start + attack, time), 1 - smooth(end - release, end, time));
};
const add = (index, left, right = left) => {
  if (index < 0 || index >= samples) return;
  mix[index * 2] += left;
  mix[index * 2 + 1] += right;
};
const sine = ({ freq, start, end, amp, attack = 0.12, release = 0.35, pan = 0, vibrato = 0 }) => {
  for (let i = Math.max(0, Math.floor(start * sampleRate)); i < Math.min(samples, Math.ceil(end * sampleRate)); i += 1) {
    const time = i / sampleRate;
    const local = time - start;
    const signal =
      Math.sin(2 * Math.PI * (freq + Math.sin(local * 1.4) * vibrato) * local) *
      amp *
      env(time, start, end, attack, release);
    add(i, signal * (1 - Math.max(0, pan)), signal * (1 + Math.min(0, pan)));
  }
};
const piano = (start, freq, amp = 0.1, pan = 0) => {
  const end = start + 2.8;
  for (let i = Math.max(0, Math.floor(start * sampleRate)); i < Math.min(samples, Math.ceil(end * sampleRate)); i += 1) {
    const t = i / sampleRate - start;
    const decay = Math.exp(-2.35 * t);
    const tone =
      Math.sin(2 * Math.PI * freq * t) * 0.8 +
      Math.sin(2 * Math.PI * freq * 2.01 * t) * 0.28 +
      Math.sin(2 * Math.PI * freq * 3.04 * t) * 0.1;
    const signal = tone * decay * amp;
    add(i, signal * (1 - Math.max(0, pan)), signal * (1 + Math.min(0, pan)));
  }
};
const noise = ({ start, end, amp, color = 0.95, pan = 0, attack = 0.05, release = 0.15 }) => {
  let last = 0;
  for (let i = Math.max(0, Math.floor(start * sampleRate)); i < Math.min(samples, Math.ceil(end * sampleRate)); i += 1) {
    const time = i / sampleRate;
    last = last * color + (Math.random() * 2 - 1) * (1 - color);
    const signal = last * amp * env(time, start, end, attack, release);
    add(i, signal * (1 - Math.max(0, pan)), signal * (1 + Math.min(0, pan)));
  }
};
const kick = (start, amp = 0.12) => {
  for (let i = Math.floor(start * sampleRate); i < Math.min(samples, Math.ceil((start + 0.42) * sampleRate)); i += 1) {
    const t = i / sampleRate - start;
    add(i, Math.sin(2 * Math.PI * (78 * Math.exp(-5.4 * t) + 35) * t) * Math.exp(-9.5 * t) * amp);
  }
};
const chime = (start, amp = 0.1) => {
  piano(start, notes.D4, amp, -0.08);
  piano(start + 0.08, notes.FS4, amp * 0.82, 0.08);
};

noise({ start: 0, end: 5, amp: 0.012, color: 0.96 });
noise({ start: 1.1, end: 1.85, amp: 0.018, color: 0.98 });
noise({ start: 5, end: 12, amp: 0.035, color: 0.985, attack: 0.6 });
sine({ freq: notes.D3, start: 5, end: 65, amp: 0.035, attack: 2.4, release: 4.8, pan: -0.12, vibrato: 0.5 });
sine({ freq: notes.A3, start: 12, end: 65, amp: 0.026, attack: 2.0, release: 4.8, pan: 0.16, vibrato: 0.35 });
sine({ freq: notes.FS4, start: 20, end: 55, amp: 0.018, attack: 3.0, release: 3.5, pan: 0.08, vibrato: 0.45 });
for (const start of [12.1, 16.0, 20.2, 24.1, 28.1, 32.2, 36.1, 40.1, 45.2, 49.1]) {
  piano(start, notes.D4, 0.08, -0.08);
  piano(start + 0.48, notes.FS4, 0.055, 0.06);
  piano(start + 0.96, notes.A4, 0.052, 0.1);
  piano(start + 1.45, notes.E5, 0.04, -0.04);
}
for (let t = 35; t < 55; t += 1.6667) kick(t, t < 45 ? 0.095 : 0.13);
chime(12.05, 0.08);
chime(35.1, 0.095);
noise({ start: 36, end: 44.6, amp: 0.026, color: 0.98 });
noise({ start: 45, end: 46, amp: 0.04, color: 0.8 });
noise({ start: 47.1, end: 51.8, amp: 0.035, color: 0.93 });
piano(70.05, notes.D4, 0.09);

let max = 0;
for (const sample of mix) max = Math.max(max, Math.abs(sample));
const gain = max > 0 ? 0.78 / max : 1;
for (let i = 0; i < mix.length; i += 1) mix[i] *= gain;

const writeWav = (file, buffer) => {
  const dataBytes = samples * channels * 2;
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataBytes, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * channels * 2, 28);
  wav.writeUInt16LE(channels * 2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples * channels; i += 1) {
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buffer[i] || 0)) * 32767), 44 + i * 2);
  }
  writeFileSync(file, wav);
};

writeWav(join(outDir, "score-sfx.wav"), mix);

const voiceovers = [
  ["vo-01", "كل يوم... نفس السؤال.", "125"],
  ["vo-02", "ليه اختيار لبسك... بياخد كل ده؟", "138"],
  ["vo-03", "تخيل إن كل المولات... في موبايلك.", "132"],
  ["vo-04", "اختار... في ثواني.", "118"],
  ["vo-05", "واطلب... وانت في مكانك.", "128"],
  ["vo-06", "ويجيلك... لحد باب بيتك.", "125"],
  ["vo-07", "ولو عندك محل... هنوصلك عملاء، من غير ما تتعب.", "135"],
];

for (const [id, text, rate] of voiceovers) {
  const aiff = join(outDir, `${id}.aiff`);
  const wav = join(outDir, `${id}.wav`);
  rmSync(aiff, { force: true });
  rmSync(wav, { force: true });
  const say = spawnSync("say", ["-v", "Majed", "-r", rate, "-o", aiff, text], { stdio: "inherit" });
  if (say.status !== 0) throw new Error(`say failed for ${id}`);
  const convert = spawnSync("afconvert", [aiff, wav, "-f", "WAVE", "-d", "LEI16@48000"], { stdio: "inherit" });
  if (convert.status !== 0) throw new Error(`afconvert failed for ${id}`);
  rmSync(aiff, { force: true });
}

console.log(`Generated DRAPE score, SFX, and placeholder VO in ${outDir}`);

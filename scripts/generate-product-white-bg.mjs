import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const uploadsDir = path.join(root, "public", "uploads");
const outputDir = path.join(uploadsDir, "product-white-bg");
const manifestPath = path.join(root, "lib", "generatedProductWhiteBgImages.ts");

async function collectSourceFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(absolute));
    } else if (/\.(?:ts|tsx|json)$/i.test(entry.name)) {
      files.push(absolute);
    }
  }

  return files;
}

const sourceFiles = [
  ...await collectSourceFiles(path.join(root, "lib")),
  ...await collectSourceFiles(path.join(root, "data")),
];

const imagePathSet = new Set();
for (const sourceFile of sourceFiles) {
  if (sourceFile.endsWith(path.join("lib", "generatedProductWhiteBgImages.ts"))) continue;
  const source = await fs.readFile(sourceFile, "utf8");
  const matches = [
    ...source.matchAll(/"\/uploads\/([^"]+\.(?:png|jpe?g|webp))"/gi),
    ...source.matchAll(/'\/uploads\/([^']+\.(?:png|jpe?g|webp))'/gi),
    ...source.matchAll(/"([^"\/\\]+?\.(?:png|jpe?g|webp))"/gi),
    ...source.matchAll(/'([^'\/\\]+?\.(?:png|jpe?g|webp))'/gi),
  ];

  for (const match of matches) {
    const file = match[1];
    if (!file || file.startsWith("product-white-bg/")) continue;
    imagePathSet.add(file);
  }
}

const imagePaths = Array.from(imagePathSet);

await fs.mkdir(outputDir, { recursive: true });

const lightProductTokens = [
  "beige",
  "bone",
  "cream",
  "ecru",
  "ivory",
  "light",
  "natural",
  "off white",
  "off-white",
  "pearl",
  "sand",
  "stone",
  "tan",
  "white",
];

function outputName(file) {
  const parsed = path.parse(file);
  return `${parsed.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}.png`;
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function distance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function edgeAverage(data, width, height) {
  const samples = [];
  const add = (x, y) => {
    const index = (y * width + x) * 4;
    samples.push([data[index], data[index + 1], data[index + 2]]);
  };

  for (let x = 0; x < width; x += 8) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 0; y < height; y += 8) {
    add(0, y);
    add(width - 1, y);
  }

  return samples.reduce(
    (sum, sample) => [sum[0] + sample[0], sum[1] + sample[1], sum[2] + sample[2]],
    [0, 0, 0],
  ).map((value) => value / samples.length);
}

function shouldPreserveOriginalPixels(file) {
  const normalized = file.replace(/[_-]+/g, " ").toLowerCase();
  return lightProductTokens.some((token) => normalized.includes(token));
}

function isBackgroundPixel(data, pixelIndex, average) {
  const index = pixelIndex * 4;
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const a = data[index + 3];
  const l = luminance(r, g, b);
  const edgeDistance = distance([r, g, b], average);

  if (a < 245) return true;
  if (edgeDistance < 42 && l > 125) return true;
  return false;
}

function whitenEdgeConnectedBackground(data, width, height) {
  const average = edgeAverage(data, width, height);
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel] || !isBackgroundPixel(data, pixel, average)) return;
    visited[pixel] = 1;
    queue.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pixel = queue[cursor];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  for (const pixel of queue) {
    const index = pixel * 4;
    data[index] = 255;
    data[index + 1] = 255;
    data[index + 2] = 255;
    data[index + 3] = 255;
  }
}

const manifest = {};

for (const file of imagePaths) {
  const input = path.join(uploadsDir, file);
  const output = path.join(outputDir, outputName(file));

  try {
    const image = sharp(input).rotate().ensureAlpha();
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) continue;
    const raw = await image.raw().toBuffer();
    if (!shouldPreserveOriginalPixels(file)) {
      whitenEdgeConnectedBackground(raw, metadata.width, metadata.height);
    }
    await sharp(raw, {
      raw: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
      },
    })
      .png({ compressionLevel: 9, palette: false })
      .toFile(output);

    manifest[`/uploads/${file}`] = `/uploads/product-white-bg/${outputName(file)}`;
  } catch (error) {
    console.warn(`Skipping ${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const manifestSource = `// Generated by scripts/generate-product-white-bg.mjs. Do not edit manually.
export const productWhiteBgImages: Record<string, string> = ${JSON.stringify(manifest, null, 2)};
`;

await fs.writeFile(manifestPath, manifestSource);
console.log(`Generated ${Object.keys(manifest).length} white-background product images.`);

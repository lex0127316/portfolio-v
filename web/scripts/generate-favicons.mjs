import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sourceImage = path.join(publicDir, "logo", "bird_2.jpg");

const faviconSizes = [16, 32, 192, 512];
const appleTouchSize = 180;

async function ensureSourceExists() {
  try {
    await fs.access(sourceImage);
  } catch {
    throw new Error(`Source logo not found at ${sourceImage}`);
  }
}

async function generatePngFavicons() {
  await Promise.all(
    faviconSizes.map((size) =>
      sharp(sourceImage)
        .resize(size, size, { fit: "cover" })
        .png({ compressionLevel: 9 })
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`)),
    ),
  );

  await sharp(sourceImage)
    .resize(appleTouchSize, appleTouchSize, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
}

async function generateIco() {
  const icoBuffer = await pngToIco(
    faviconSizes
      .filter((size) => size <= 64)
      .map((size) => path.join(publicDir, `favicon-${size}x${size}.png`)),
  );
  await fs.writeFile(path.join(publicDir, "favicon.ico"), icoBuffer);
}

async function main() {
  await ensureSourceExists();
  console.log("Generating favicon images...");
  await generatePngFavicons();
  console.log("Generating favicon.ico...");
  await generateIco();
  console.log("Favicons generated successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


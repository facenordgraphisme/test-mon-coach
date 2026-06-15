import sharp from "sharp";
import { writeFileSync } from "fs";
import { join } from "path";

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0C4730" />
      <stop offset="100%" stop-color="#17624A" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />

  <!-- Mountain silhouettes -->
  <polygon points="0,630 0,460 220,300 400,460 600,260 820,460 1000,340 1200,460 1200,630" fill="#ffffff" opacity="0.06" />
  <polygon points="0,630 0,520 260,400 520,520 760,380 1000,520 1200,440 1200,630" fill="#ffffff" opacity="0.08" />

  <!-- Eyebrow label -->
  <text x="100" y="230" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="6" fill="#E7E5E4" opacity="0.85">HAUTES-ALPES</text>

  <!-- Title -->
  <text x="100" y="330" font-family="Arial, sans-serif" font-size="84" font-weight="700" fill="#FFFFFF">Rêves d&#8217;Aventures</text>

  <!-- Divider -->
  <rect x="100" y="370" width="120" height="6" rx="3" fill="#FFFFFF" opacity="0.8" />

  <!-- Tagline -->
  <text x="100" y="440" font-family="Arial, sans-serif" font-size="40" font-weight="500" fill="#F5F5F4">Escalade · Canyoning · VTT</text>
  <text x="100" y="495" font-family="Arial, sans-serif" font-size="40" font-weight="500" fill="#F5F5F4">Lac de Serre-Ponçon</text>
</svg>
`;

const outPath = join(process.cwd(), "public", "assets", "og-default.png");

const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outPath, buffer);
console.log("Wrote", outPath, buffer.length, "bytes");

import sharp from "sharp";

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.04 0"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="#16130F"/>
  <rect width="1200" height="630" filter="url(#noise)"/>
  <rect x="80" y="78" width="8" height="8" fill="#DC7A4F"/>
  <text x="108" y="102" font-family="Unbounded, Arial Black, system-ui, sans-serif" font-size="64" font-weight="900" fill="#F2EDE3" letter-spacing="1">SERGEY RAMAS ·</text>
  <text x="76" y="318" font-family="Unbounded, Arial Black, system-ui, sans-serif" font-size="180" font-weight="900" fill="#DC7A4F" letter-spacing="-6">AI HUB</text>
  <rect x="84" y="360" width="600" height="1" fill="#DC7A4F"/>
  <text x="84" y="512" font-family="JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace" font-size="28" font-weight="700" fill="#948A7E" letter-spacing="5">SOLUTIONS · PROJECTS · IDEAS</text>
  <text x="84" y="570" font-family="JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="700" fill="#F2EDE3" letter-spacing="2">sergeyramas.vercel.app</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png");
console.log("OG image created.");

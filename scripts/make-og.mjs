import sharp from "sharp";

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.04 0"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="#F4EFE6"/>
  <rect width="1200" height="630" filter="url(#noise)"/>
  <rect x="80" y="80" width="6" height="6" fill="#B85A2E"/>
  <text x="100" y="92" font-family="ui-monospace, monospace" font-size="16" fill="#6B6258" letter-spacing="2">SERGEYRAMAS.VERCEL.APP</text>
  <text x="80" y="300" font-family="Georgia, serif" font-size="120" font-weight="400" fill="#1A1714" letter-spacing="-3">Сергей Рамас.</text>
  <text x="80" y="420" font-family="Georgia, serif" font-style="italic" font-size="92" font-weight="400" fill="#B85A2E" letter-spacing="-2">Solutions, Projects,</text>
  <text x="80" y="510" font-family="Georgia, serif" font-style="italic" font-size="92" font-weight="400" fill="#B85A2E" letter-spacing="-2">Ideas.</text>
  <text x="80" y="570" font-family="ui-monospace, monospace" font-size="20" fill="#6B6258">AI · Lендинги · Автоматизация</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png");
console.log("OG image created.");

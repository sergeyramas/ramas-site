import sharp from "sharp";

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FAF8F4"/>
  <text x="80" y="120" font-family="ui-monospace, monospace" font-size="32" fill="#A04B2A">ramas</text>
  <text x="80" y="320" font-family="system-ui" font-size="84" font-weight="500" fill="#1A1A1A">Solutions.</text>
  <text x="80" y="430" font-family="system-ui" font-size="84" font-weight="500" fill="#1A1A1A">Projects. Ideas.</text>
  <text x="80" y="540" font-family="system-ui" font-size="28" fill="#6B6660">Сергей Рамас — личный сайт</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png");
console.log("OG image created.");

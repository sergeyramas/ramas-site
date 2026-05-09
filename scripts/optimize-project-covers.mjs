import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "public/covers/projects";
const files = readdirSync(dir).filter((f) => f.endsWith(".png"));

for (const f of files) {
  const slug = f.replace(/\.png$/, "");
  const src = join(dir, f);
  const dst = join(dir, `${slug}.webp`);

  // Resize to 1600x1000 (16:10), top-aligned to keep header visible.
  await sharp(src)
    .resize(1600, 1000, { fit: "cover", position: "top" })
    .webp({ quality: 78 })
    .toFile(dst);

  console.log(`${slug}: ${src} -> ${dst}`);
}

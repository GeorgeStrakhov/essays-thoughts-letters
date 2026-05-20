import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function copyTree(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyTree(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  await rmrf(PUBLIC_DIR);
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  // 1. static/ -> public/static
  await copyTree(path.join(ROOT, "static"), path.join(PUBLIC_DIR, "static"));

  // 1b. static/js -> public/js (matches old `/js/main.js` route)
  await copyTree(path.join(ROOT, "static", "js"), path.join(PUBLIC_DIR, "js"));

  // 2. essays/<slug>/img/* -> public/<slug>/img/*
  const essaysDir = path.join(ROOT, "essays");
  const slugs = await fs.readdir(essaysDir, { withFileTypes: true });
  let imgCount = 0;
  for (const slugEntry of slugs) {
    if (!slugEntry.isDirectory()) continue;
    const imgDir = path.join(essaysDir, slugEntry.name, "img");
    try {
      const stat = await fs.stat(imgDir);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }
    const destImgDir = path.join(PUBLIC_DIR, slugEntry.name, "img");
    await copyTree(imgDir, destImgDir);
    const entries = await fs.readdir(destImgDir);
    imgCount += entries.length;
  }

  console.log(`[build-assets] static + ${imgCount} essay images copied to ${PUBLIC_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

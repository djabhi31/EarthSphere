import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.resolve(ROOT, '..', 'gods-eye-view');
const DEST = path.resolve(ROOT, 'gods-eye-view');

const IGNORED_NAMES = new Set([
  '.git',
  'node_modules',
  'dist',
  '.gev-cache',
  '.gev-logs',
  'screenshots',
  'qa-shots',
  'output',
  '.DS_Store',
]);

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory not found: ${src}`);
    process.exit(1);
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_NAMES.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

console.log(`[sync-gev] Syncing files from ${SOURCE} -> ${DEST}...`);
const total = copyDir(SOURCE, DEST);
console.log(`[sync-gev] Successfully synced ${total} files into EarthSphere/gods-eye-view!`);

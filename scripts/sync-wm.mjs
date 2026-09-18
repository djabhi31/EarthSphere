import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WM_DIR = path.resolve(ROOT, '..', 'worldmonitor');

console.log('[sync-wm] Triggering World Monitor Lifetime Upstream Sync Engine...');
try {
  execSync('node scripts/sync-upstream.mjs', {
    cwd: WM_DIR,
    stdio: 'inherit',
    encoding: 'utf8',
  });
} catch (err) {
  console.error('[sync-wm] Error during World Monitor sync:', err);
  process.exit(1);
}

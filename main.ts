// Leonida Legend — hand-in program for the gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// The entry itself is the static guide under app/: plain files, no build step, opened at app/index.html,
// working with the network off and fetching only its own app/data/trophies.json. This program's one job is
// the hand-in: copy app/ and screenshots/ from beside this file into the output directory and write the
// dossier the judge reads, using buildDossier from the vendored make.fun library. The vendor file stays
// untouched — the scorer rebuilds the dossier with its own copy and requires a byte-for-byte match.
//
// The output directory is /output inside the grader; locally, MAKEFUN_OUTPUT_DIR stands in for it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Try the guide itself with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy the guide and its screenshots next to where the dossier will be written.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
const screenshotsSource = join(repoRoot, 'screenshots');
if (existsSync(screenshotsSource)) {
  cpSync(screenshotsSource, join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier caps are the scorer's own for this bounty: the text cap shapes the dossier's bytes, and the
// rest make this program refuse exactly what the scorer would refuse — more than 4 screenshots or one
// over 256 KiB, more than 993 files and directories under app/, or more than 48 MiB of app files.
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};
writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, dossierCaps));

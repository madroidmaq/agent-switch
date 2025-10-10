#!/usr/bin/env tsx
import { build } from 'esbuild';
import { chmod, writeFile } from 'fs/promises';
import { join } from 'path';

async function buildCLI() {
  console.log('Building Agent Switch...');

  await build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: 'dist/index.mjs',
    format: 'esm',
    external: [
      'ink',
      'react',
      'ink-*',
      'chalk',
      'commander',
      'zod',
    ],
    banner: {
      js: '#!/usr/bin/env node\n',
    },
    minify: false,
    sourcemap: true,
  });

  // Make the output file executable
  await chmod('dist/index.mjs', 0o755);

  console.log('✓ Build complete!');
}

buildCLI().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});

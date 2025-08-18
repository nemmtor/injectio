import * as path from 'node:path';
import type { ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = {
  test: {
    setupFiles: [path.join(__dirname, 'vitest.setup.ts')],
    sequence: {
      concurrent: true,
    },
    include: ['test/**/*.test.ts'],
  },
};

export default config;

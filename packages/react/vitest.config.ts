import path from 'node:path';
import { mergeConfig, type ViteUserConfig } from 'vitest/config';
import shared from '../../vitest.shared.js';

const config: ViteUserConfig = {
  test: {
    environment: 'jsdom',
    setupFiles: [path.join(__dirname, 'vitest.setup.ts')],
    include: ['test/**/*.test.tsx'],
    exclude: ['src/index.ts', '**/index.ts'],
  },
};

export default mergeConfig(shared, config);

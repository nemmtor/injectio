import { mergeConfig, type ViteUserConfig } from 'vitest/config';
import shared from '../../vitest.shared.js';

const config: ViteUserConfig = {
  test: {
    coverage: {
      reporter: ['html'],
    },
  },
};

export default mergeConfig(shared, config);

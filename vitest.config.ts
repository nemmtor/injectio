import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*'],
    coverage: {
      include: ['packages/*/src'],
      exclude: ['packages/*/src/index.ts'],
    },
  },
});

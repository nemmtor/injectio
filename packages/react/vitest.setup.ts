import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from '@effect/vitest';
import { cleanup } from '@testing-library/react';
import { Core } from './src/internal/core.js';

beforeEach(() => {
  Core.reset();
});

afterEach(() => {
  cleanup();
});

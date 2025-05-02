import '@testing-library/jest-dom/vitest';
import { vitest } from 'vitest';

beforeEach(() => {
  vitest.clearAllMocks();
});

afterAll(() => {
  vitest.resetAllMocks();
});

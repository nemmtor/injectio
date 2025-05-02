import '@testing-library/jest-dom/vitest';
import { vitest } from 'vitest';

import { InjectioObserver } from './injectio-observer';

beforeEach(() => {
  InjectioObserver.getNewInstance();
  vitest.clearAllMocks();
});

afterAll(() => {
  vitest.resetAllMocks();
});

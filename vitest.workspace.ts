import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'lib/*',
  'packages/*/vitest.config.ts',
])

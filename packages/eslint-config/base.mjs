// @ts-check
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { config, configs } from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import vitestPlugin from '@vitest/eslint-plugin';
import turboPlugin from 'eslint-plugin-turbo';

export const baseConfig = config(
  { ignores: ['dist', 'node_modules'] },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    files: ['**/*.{mjs,js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      eslintConfigPrettier,
    ],
    languageOptions: {
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: {
      vitestPlugin,
    },
    extends: [vitestPlugin.configs.all],
    rules: {
      'vitest/prefer-expect-assertions': 'off',
      'vitest/require-mock-type-parameters': 'off',
      'vitest/prefer-called-with': 'off',
      'vitest/prefer-describe-function-title': 'off',
    },
    languageOptions: {
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
  }
);

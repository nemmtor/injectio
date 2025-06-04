// @ts-check
import { config } from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';

import { baseConfig } from './base.mjs';
export const reactConfig = config(
  baseConfig,
  {
    files: ['**/*.{mjs,js,jsx,ts,tsx}'],
    extends: [
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      reactHooksPlugin.configs['recommended-latest'],
    ],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [
      jestDomPlugin.configs['flat/recommended'],
      testingLibraryPlugin.configs['flat/react'],
    ],
  }
);

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{mjs,js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
};

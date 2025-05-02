/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.mjs': ['prettier --write', 'eslint --fix'],
};

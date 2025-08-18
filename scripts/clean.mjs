import * as Fs from 'node:fs';
import * as Glob from 'glob';

const files = ['.', ...Glob.sync('packages/*')];

files.forEach((pkg) => {
  const files = [
    ...(pkg === '.' ? [] : ['docs']),
    '.tsbuildinfo',
    'build',
    'dist',
    'coverage',
  ];

  files.forEach((file) => {
    Fs.rmSync(`${pkg}/${file}`, { recursive: true, force: true }, () => {});
  });
});

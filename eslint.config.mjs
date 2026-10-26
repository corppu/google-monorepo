import tsParser from '@typescript-eslint/parser';
import perfectionist from 'eslint-plugin-perfectionist';

const alphabetical = { type: 'alphabetical', order: 'asc' };

export default [
  {
    files: ['lib-*/src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: [
          './tsconfig.json',
          './app-*/tsconfig.json',
          './lib-*/tsconfig.json',
        ],
      },
    },
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-interfaces': ['error', alphabetical],
      'perfectionist/sort-object-types': ['error', alphabetical],
      'perfectionist/sort-objects': ['error', alphabetical],
    },
  },
];

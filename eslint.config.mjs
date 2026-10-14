import babelParser from '@babel/eslint-parser';
import perfectionist from 'eslint-plugin-perfectionist';

const alphabetical = { type: 'alphabetical', order: 'asc' };

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [['@babel/plugin-syntax-typescript', { isTSX: true }]],
        },
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

/** @type {import("stylelint").Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'import-notation': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: [
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/storybook-static/**',
    '**/node_modules/**',
  ],
};

import globals from 'globals';
import customJS from 'eslint-config-dafi/flat/javascript/index.mjs';
import customTypescript from 'eslint-config-dafi/flat/typescript/index.mjs';
import customReact from 'eslint-config-dafi/flat/reactjs/index.mjs';
import customStylistic from 'eslint-config-dafi/flat/stylistic/index.mjs';

import tsParser from '@typescript-eslint/parser';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    ignores: [
      'eslint.config.js',
      'vite.config.ts',
      'dist/'
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        project: [
          'tsconfig.json'
        ],
      }
    },
  },
  ...customJS,
  ...customTypescript,
  ...customReact,
  ...customStylistic,
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  }
];

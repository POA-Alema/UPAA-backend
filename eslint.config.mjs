// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["commitlint.config.js"],
  },
  {
    files: ["docker/mongo-init/**/*.js"],
    languageOptions: {
      globals: {
        ObjectId: "readonly",
        db: "readonly",
        print: "readonly",
        use: "readonly",
      },
    },
  }
);

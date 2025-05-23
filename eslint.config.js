// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint'; // Import ONCE
import prettierPlugin from 'eslint-plugin-prettier'; // The plugin itself
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // The "recommended" config object from the plugin
import eslintConfigPrettier from 'eslint-config-prettier'; // Config to turn off ESLint rules that conflict with Prettier

export default [
  {
    ignores: ['node_modules/', 'dist/'],
  },

  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'], // Apply to JS files
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginPrettierRecommended.rules,
    },
  },

  // Configuration for TypeScript files
  {
    files: ['src/**/*.ts'], // Apply only to .ts files in src
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...eslintPluginPrettierRecommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  eslintConfigPrettier,
];

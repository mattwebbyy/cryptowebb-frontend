// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier'; // Import prettier config

// Create a clean copy of browser globals to avoid whitespace issues
const browserGlobals = {};
Object.entries(globals.browser).forEach(([key, value]) => {
  // Remove any leading or trailing whitespace from keys
  const trimmedKey = key.trim();
  browserGlobals[trimmedKey] = value;
});

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended, // Apply TS recommendations
  // Optional: If you want stricter type checking (requires parserOptions.project configuration)
  // ...tseslint.configs.recommendedTypeChecked,
  // ...tseslint.configs.strictTypeChecked,
  {
    // Settings specific to TS/TSX files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // Uncomment and configure if using type-aware linting
        // project: true,
        // tsconfigRootDir: import.meta.dirname,
      },
      globals: browserGlobals, // Use the cleaned globals object
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Add any specific TS/React rules here if needed
      '@typescript-eslint/no-unused-vars': 'warn', // Example: warn about unused vars
      '@typescript-eslint/no-explicit-any': 'warn', // Example: warn about explicit 'any'
    },
  },
  // IMPORTANT: Add Prettier config LAST to override other formatting rules
  eslintConfigPrettier
);

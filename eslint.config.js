// @ts-check
// Import ESLint core
import eslint from '@eslint/js';

// Import TypeScript ESLint
import tseslint from 'typescript-eslint';

// Import Angular ESLint
import angular from 'angular-eslint';

export default tseslint.config(
    {
        ignores: ['**/dist/**', '**/.angular/**']
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended
        ],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/no-input-rename': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/prefer-for-of': 'off',
            '@typescript-eslint/consistent-type-assertions': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/consistent-type-definitions': 'warn'
        }
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {
            '@angular-eslint/template/no-negated-async': 'off'
        }
    }
);

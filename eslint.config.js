// @ts-check

// Allows us to bring in the recommended core rules from eslint itself
import eslintPlugin from '@eslint/js';
const { configs } = eslintPlugin;

// Allows us to use the typed utility for our config, and to bring in the recommended rules for TypeScript projects from typescript-eslint
import { config, configs as _configs } from 'typescript-eslint';

// Allows us to bring in the recommended rules for Angular projects from angular-eslint
import { configs as __configs, processInlineTemplates } from 'angular-eslint';
// Export our config array, which is composed together thanks to the typed utility function from typescript-eslint
export default config(
    {
        // Everything in this config object targets our TypeScript files (Components, Directives, Pipes etc)
        files: ['**/*.ts'],
        extends: [
            // Apply the recommended core rules
            configs.recommended,
            // Apply the recommended TypeScript rules
            ..._configs.recommended,
            // Optionally apply stylistic rules from typescript-eslint that improve code consistency
            ..._configs.stylistic,
            // Apply the recommended Angular rules
            ...__configs.tsRecommended
        ],
        // Set the custom processor which will allow us to have our inline Component templates extracted
        // and treated as if they are HTML files (and therefore have the .html config below applied to them)
        processor: processInlineTemplates,
        // Override specific rules for TypeScript files (these will take priority over the extended configs above)
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case'
                }
            ]
        }
    },
    {
        // Everything in this config object targets our HTML files (external templates,
        // and inline templates as long as we have the `processor` set on our TypeScript config above)
        files: ['**/*.html'],
        extends: [
            // Apply the recommended Angular template rules
            ...__configs.templateRecommended,
            // Apply the Angular template rules which focus on accessibility of our apps
            ...__configs.templateAccessibility
        ],
        rules: {}
    }
);

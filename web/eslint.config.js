import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';

export default tseslint.config({
    files: [
        'src/**/*.js',
        'src/**/*.ts',
        'test/**/*.ts',
    ],
    plugins: {
        '@typescript-eslint': tseslint.plugin,
        '@stylistic': stylistic,
        'tsdoc': tsdoc,
    },
    languageOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        parser: tseslint.parser,
        globals: {}
    },
    rules: {
        'semi': [ 'error', 'always' ],
        'no-extra-parens': 'off',
        '@stylistic/no-extra-parens': 'error',
        '@typescript-eslint/no-unused-vars': [ 'error', { 'argsIgnorePattern': '^_' } ],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'comma-spacing': 'warn',
        'comma-style': 'warn',
        'indent': [ 'error', 4, { 'SwitchCase': 1 } ],
        'key-spacing': 'warn',
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxBOF': 0, 'maxEOF': 0 } ],
        'no-multi-spaces': 'error',
        'no-throw-literal': 'error',
        'tsdoc/syntax': 'warn',
        /**
         * Use restricted properties as workaround to address a flaw in the typescript system of global declarations.
         * Globally declared modules (such as @types/node::Buffer) should be declared for e.g., tests but must not be declared for the web-application (browsers do not have `Buffer`).
         * Unfortunately, once included these are available everywhere in the workspace without exception.
         * See also: https://github.com/microsoft/TypeScript/issues/50424
         */
        'no-restricted-properties': [ 'error', {
            "object": "Buffer",
            "property": "from"
        } ],
        '@typescript-eslint/naming-convention': [ 'error', // See: https://typescript-eslint.io/rules/naming-convention/#options
            /*
            {
                selector: 'default',
                format: [ 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'variable',
                format: [ 'camelCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'variableLike',
                format: [ 'camelCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            */
            {
                selector: 'classProperty',
                modifiers: [ 'private', 'protected' ],
                format: [ 'camelCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'classProperty',
                modifiers: [ 'public' ],
                format: [ 'camelCase', 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'classicAccessor',
                format: [ 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'classicAccessor',
                modifiers: [ 'override' ],
                format: [ 'camelCase', 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'autoAccessor',
                format: [ 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'classMethod',
                format: [ 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'classMethod',
                modifiers: [ 'override' ],
                format: [ 'camelCase', 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'parameter',
                format: [ 'camelCase' ],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'typeLike',
                format: [ 'PascalCase' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'typeParameter',
                format: [ 'PascalCase' ],
                //prefix: ['T'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                selector: 'interface',
                format: [ 'PascalCase' ],
                //prefix: ['I'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
        ],
    }
},
// Overrides for auto-generated translations by Crowdin
{
    files: [
        'src/i18n/locales/*.ts'
    ],
    rules: {
        'indent': [ 'warn', 2 ]
    }
});
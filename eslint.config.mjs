import antfu from '@antfu/eslint-config';

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu(
    {
      type: 'app',
      vue: true,
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
      },
      ignores: ['.pnpm-store/**', '**/migrations/*'],
    },
    {
      rules: {
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 3,
          },
          multiline: {
            max: 1,
          },
        }],
        'ts/no-redeclare': ['off'],
        'ts/consistent-type-definitions': ['error', 'type'],
        'no-console': ['warn'],
        'node/prefer-global/process': ['off'],
        'node/no-process-env': ['error'],
        'perfectionist/sort-imports': [
          'error',
          {
            tsconfigRootDir: '.',
          },
        ],
        'unicorn/filename-case': [
          'error',
          {
            case: 'kebabCase',
            ignore: ['README.md'],
          },
        ],
      },
    },
  ),
);

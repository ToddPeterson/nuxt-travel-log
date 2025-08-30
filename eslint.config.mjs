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
            indent: 3,
            semi: true,
         },
      },
      {
         rules: {
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

import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/test-output',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: 'scope:app', onlyDependOnLibsWithTags: ['*'] },
            {
              sourceTag: 'scope:app1',
              onlyDependOnLibsWithTags: [
                'scope:app1',
                'scope:shared',
                'scope:ui',
                'scope:auth',
              ],
            },
            {
              sourceTag: 'scope:app2',
              onlyDependOnLibsWithTags: [
                'scope:app2',
                'scope:shared',
                'scope:ui',
                'scope:auth',
              ],
            },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: ['scope:ui', 'scope:shared'],
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: [
                'scope:auth',
                'scope:shared',
                'scope:ui',
              ],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'platform:client',
              onlyDependOnLibsWithTags: [
                'platform:client',
                'platform:isomorphic',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];

// Flat config for ESLint 9 + Next 16.
//
// Before this file, `npm run lint` never linted this project. The lint script
// was in package.json but eslint was not a dependency, so the command exited 2
// against whatever eslint happened to be on the machine's PATH ("couldn't find
// an eslint.config file") — a different major version from the one now pinned.
//
// eslint-config-next v16 exports a flat-config array directly. Do NOT route it
// through @eslint/eslintrc FlatCompat — that pairing throws
// "TypeError: Converting circular structure to JSON".
import coreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    ignores: [
      '.next/**', 'node_modules/**', 'out/**', 'build/**', 'coverage/**',
      'next-env.d.ts',
      // Vendored shadcn/ui primitives, generated from the upstream registry.
      // Editing them to satisfy lint means diverging from upstream and owning
      // the merge cost forever. Linted app code is what we actually control.
      'components/ui/**',
    ],
  },
  ...coreWebVitals,
]

export default config

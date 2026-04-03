# SETUP

```

//COMANDOS

npx create-next-app@latest
npx shadcn@latest init
npm install -D prettier prettier-plugin-tailwindcss
npm install --save-dev eslint-plugin-simple-import-sort
```

## PASSO A PASSO

1 - Configurar o eslint.config.mjs e adicionar a configuração do plugin simple-import-sort

```

  import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig

```

2 -

```

```

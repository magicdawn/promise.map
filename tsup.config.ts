import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    target: 'es2022',
    clean: true,
    dts: true,
    esbuildOptions(options, context) {
      options.charset = 'utf8'
    },
  }
})

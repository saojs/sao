const { build: esbuild } = require('esbuild')
const { rollup } = require('rollup')

async function build() {
  await esbuild({
    entryPoints: ['./src/index.ts'],
    format: 'cjs',
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    logLevel: 'error',
    write: true,
    target: 'es2018',
    external: Object.keys(require('../package.json').dependencies || {}),
  })
}

async function dts() {
  const bundle = await rollup({
    input: './src/index.ts',
    plugins: [require('rollup-plugin-dts').default()],
  })
  await bundle.write({
    dir: 'dist',
    format: 'esm',
  })
}

async function main() {
  await Promise.all([build(), dts()])
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

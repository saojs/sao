const fs = require('fs')
const { build: esbuild } = require('esbuild')
const { transform } = require('sucrase')
const { dirname } = require('path')
const { rollup } = require('rollup')

async function build() {
  const result = await esbuild({
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    logLevel: 'error',
    write: false,
    target: 'es2018',
    external: Object.keys(require('../package.json').dependencies || {}),
  })
  if (result.outputFiles) {
    await Promise.all(
      result.outputFiles.map(async (file) => {
        const res = transform(new TextDecoder('utf-8').decode(file.contents), {
          transforms: ['imports'],
        })
        await fs.promises.mkdir(dirname(file.path), { recursive: true })
        await fs.promises.writeFile(file.path, res.code, 'utf8')
      })
    )
  }
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

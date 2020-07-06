import esbuildPlugin from 'rollup-plugin-esbuild'
import dtsPlugin from 'rollup-plugin-dts'
import hashbangPlugin from 'rollup-plugin-hashbang'

const createConfig = ({ dts } = {}) => {
  return {
    input: [!dts && './src/cli.ts', './src/index.ts'].filter(Boolean),
    output: {
      format: 'cjs',
      dir: 'dist',
    },
    plugins: [
      hashbangPlugin(),
      !dts && esbuildPlugin(),
      dts && dtsPlugin(),
    ].filter(Boolean),
  }
}

export default [createConfig(), createConfig({ dts: true })]

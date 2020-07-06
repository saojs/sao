// @ts-check
import { builtinModules } from 'module'
import esbuildPlugin from 'rollup-plugin-esbuild'
import dtsPlugin from 'rollup-plugin-dts'
import hashbangPlugin from 'rollup-plugin-hashbang'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'

const deps = Object.keys(require('./package.json').dependencies)

/**
 * @param {{dts?: boolean}} options
 * @returns {import('rollup').RollupOptions}
 */
const createConfig = ({ dts } = {}) => {
  const nodeResolve = nodeResolvePlugin()
  return {
    input: [!dts && './src/cli.ts', './src/index.ts'].filter(Boolean),
    output: {
      format: 'cjs',
      dir: 'dist',
    },
    plugins: [
      hashbangPlugin(),
      !dts && esbuildPlugin(),
      !dts && commonjsPlugin(),
      !dts && {
        ...nodeResolve,

        async resolveId(source, importer) {
          let result = null

          if (builtinModules.includes(source)) {
            result = false
          } else if (deps.includes(source)) {
            result = null
          } else {
            result = await nodeResolve.resolveId.call(this, source, importer)
          }

          console.log(source, result)
          return result
        },
      },
      dts && dtsPlugin(),
    ].filter(Boolean),
  }
}

export default [createConfig(), createConfig({ dts: true })]

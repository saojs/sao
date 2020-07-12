import { join } from 'path'
import { readFileSync } from 'fs'
import { CAC } from 'cac'
import colors from 'chalk'
import { SAO } from '../'

// In production we use __dirname because this file is in dist folder
// When running via `ts-node` we use parent folder of __dirname because
// this file is in src/cmd folder
const CURRENT_DIR = __dirname.includes('/sao/src/')
  ? join(__dirname, '../')
  : __dirname

export const version = (cli: CAC) => async (
  generator: string,
  options: { debug?: boolean }
) => {
  if (!generator) {
    const pkg = JSON.parse(
      readFileSync(join(CURRENT_DIR, '../package.json'), 'utf8')
    )
    console.log(`sao: ${pkg.version}`)
    console.log(`node: ${process.versions.node}`)
    console.log(`os: ${process.platform}`)
    return
  }

  const sao = new SAO({
    generator,
    debug: options.debug,
  })

  const generators = sao.generatorsListStore.findGenerators(sao.parsedGenerator)

  const versions = []
  for (const g of generators) {
    if (g.type === 'npm') {
      versions.push(g.version)
    } else if (g.type === 'repo') {
      versions.push(g.version)
    }
  }
  if (versions.length > 0) {
    console.log(colors.cyan(`Installed versions:\n`))
    console.log(
      versions
        .map((version) => `${colors.dim('-')} ${colors.bold(version)}`)
        .join('\n')
    )
  }
}

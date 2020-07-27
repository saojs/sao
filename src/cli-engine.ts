import { join } from 'path'
import { readFileSync } from 'fs'
import cac from 'cac'

const runByTsNode = __filename.includes('/sao/src/')

export async function runCLI(): Promise<void> {
  const bin = runByTsNode ? 'yarn sao' : 'sao'
  const cli = cac(bin)

  cli
    .command('[generator] [outDir]', 'Run a generator')
    .action((generator, outDir) =>
      import('./cmd/main').then((res) => res.main(cli)(generator, outDir))
    )
    .option(
      '--npm-client <client>',
      `Use a specific npm client ('yarn' | 'npm' | 'pnpm')`
    )
    .option('-u, --update', 'Update cached generator')
    .option('-c, --clone', 'Clone repository instead of archive download')
    .option('-y, --yes', 'Use the default value for all prompts')
    .option(
      '--registry <registry>',
      'Use a custom registry for package manager'
    )
    .option(
      '--answers.* [value]',
      'Skip specific prompt and use provided answer instead'
    )
    .option('--debug', 'Display debug logs')
    .option('--version', 'Display SAO version')
    .option('-h, --help', 'Display CLI usages')

  cli
    .command('set-alias <name> <value>', 'Set an alias for a generator path')
    .option('-h, --help', 'Display CLI usages')
    .action((name, value) =>
      import('./cmd/set-alias').then((res) => res.setAlias()(name, value))
    )

  cli
    .command('get-alias <name>', 'Get the generator for an alias')
    .option('-h, --help', 'Display CLI usages')
    .action((name) =>
      import('./cmd/get-alias').then((res) => res.getAlias(cli)(name))
    )

  cli
    .command('list', 'List all downloaded generators')
    .option('-h, --help', 'Display CLI usages')
    .action(() => import('./cmd/list').then((res) => res.list()()))

  cli.parse(process.argv, { run: false })

  if (cli.options.version && cli.args.length === 0) {
    const pkg = JSON.parse(
      readFileSync(join(__dirname, '../package.json'), 'utf8')
    )
    console.log(`sao: ${pkg.version}`)
    console.log(`node: ${process.versions.node}`)
    console.log(`os: ${process.platform}`)
  } else if (cli.matchedCommand?.name !== '' && cli.options.help) {
    cli.outputHelp()
  } else {
    await cli.runMatchedCommand()
  }
}

#!/usr/bin/env node
const cac = require('cac')
const pkg = require('../package')

const cli = cac('sao')

cli
  .command('<generator> [outDir]', 'Run a generator')
  .action((generator, outDir, flags) => {
    const options = Object.assign(
      {
        generator,
        outDir: outDir || '.',
        updateCheck: true
      },
      flags
    )

    return require('../')(options)
      .run()
      .catch(err => {
        require('..').handleError(err)
      })
  })
  .option(
    '--npm-client <client>',
    `Use a specific npm client ('yarn' | 'npm' | 'pnpm')`
  )
  .option('-u, --update', 'Update cached generator')
  .option('-c, --clone', 'Clone repository instead of archive download')
  .option('-y, --yes', 'Use the default options')
  .option('--registry <registry>', 'Use a custom registry for package manager')
  .option('--answers <json>', 'Skip prompts and use provided answers directly')
  .option('--debug', 'Show debug logs')

cli
  .command('set-alias <name> <value>', 'Set an alias for a generator path')
  .action((name, value) => {
    const store = require('../lib/store')
    const { escapeDots } = require('../lib/utils/common')
    const logger = require('../lib/logger')

    store.set(`alias.${escapeDots(name)}`, value)
    logger.success(`Added alias '${name}'`)
  })

cli
  .command('get-alias <name>', 'Get the generator for an alias')
  .action(name => {
    const store = require('../lib/store')
    const { escapeDots } = require('../lib/utils/common')

    console.log(store.get(`alias.${escapeDots(name)}`))
  })

cli.version(pkg.version)
cli.help()

cli.parse()

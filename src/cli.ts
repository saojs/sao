#!/usr/bin/env node
import { join } from 'path'
import { readFileSync } from 'fs'
import cac from 'cac'
import { Options } from '.'

const cli = cac('sao')

cli
  .command('<generator> [outDir]', 'Run a generator')
  .action(async (generator, outDir, flags) => {
    const options: Options = {
      generator,
      outDir: outDir || '.',
      updateCheck: true,
      useDefaultPromptValues: flags.yes,
      ...flags,
    }
    const { SAO, handleError } = await import('./')
    return new SAO(options).run().catch((err: Error) => {
      handleError(err)
    })
  })
  .option(
    '--npm-client <client>',
    `Use a specific npm client ('yarn' | 'npm' | 'pnpm')`
  )
  .option('-u, --update', 'Update cached generator')
  .option('-c, --clone', 'Clone repository instead of archive download')
  .option('-y, --yes', 'Use the default values for prompts')
  .option('--registry <registry>', 'Use a custom registry for package manager')
  .option(
    '--answers.* [value]',
    'Skip specific prompt and use provided answer directly'
  )
  .option('--debug', 'Show debug logs')

cli
  .command('set-alias <name> <value>', 'Set an alias for a generator path')
  .action(async (name, value) => {
    const { store } = await import('./store')
    const { escapeDots } = await import('./utils/common')
    const { logger } = await import('./logger')

    store.set(`alias.${escapeDots(name)}`, value)
    logger.success(`Added alias '${name}'`)
  })

cli
  .command('get-alias <name>', 'Get the generator for an alias')
  .action(async (name) => {
    const { store } = await import('./store')
    const { escapeDots } = await import('./utils/common')

    console.log(store.get(`alias.${escapeDots(name)}`))
  })

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))

cli.version(pkg.version)
cli.help()

cli.parse()

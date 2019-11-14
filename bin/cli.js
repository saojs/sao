#!/usr/bin/env node
const cac = require('cac')
const inquirer = require('inquirer')
const pkg = require('../package')
const store = require('../lib/store')

const cli = cac('sao')

cli
  .command('[generator] [outDir]', 'Run a generator')
  .action((generator, outDir, flags) => {
    const existingGenerators = store.get('generators', {})

    function runGenerator(options) {
      require('../')(options)
        .run()
        .catch(err => {
          require('..').handleError(err)
        })
    }

    if (Object.keys(existingGenerators).length > 0 && !generator) {
      const choices = []
      for (const [key] of Object.entries(existingGenerators)) {
        let { type, name, path, slug } = existingGenerators[key]
        let genName
        switch (type) {
          case 'local': {
            const pathAry = path.split('/')
            name = pathAry[pathAry.length - 1]
            genName = path
            break
          }
          case 'repo': {
            const slugAry = slug.split('/')
            name = slugAry[slugAry.length - 1]
            genName = slug
            break
          }
          default: {
            name = name.replace('sao-', '')
            genName = name
            break
          }
        }
        choices.push({
          name: `[${type}] : ${name}`,
          value: genName
        })
      }
      const generatorPrompt = {
        type: 'list',
        name: 'generator',
        message: 'Select an existing generator:',
        choices
      }
      const outputPrompt = {
        type: 'input',
        name: 'outDir',
        message: 'File path to template output',
        default: '.'
      }
      inquirer.prompt([generatorPrompt, outputPrompt]).then(answers => {
        const { generator, outDir } = answers
        const options = {
          generator,
          outDir,
          ...flags
        }
        return runGenerator(options)
      })
    } else {
      const options = Object.assign(
        {
          generator,
          outDir: outDir || '.',
          updateCheck: true
        },
        flags
      )

      return runGenerator(options)
    }
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

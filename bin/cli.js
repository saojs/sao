#!/usr/bin/env node
const cac = require('cac').default

const cli = cac()

cli
  .command(
    '*',
    {
      desc: 'Run a generator',
      alias: 'run'
    },
    (input, flags) => {
      const options = Object.assign(
        {
          generator: input[0],
          outDir: input[1] || '.',
          updateCheck: true
        },
        flags
      )

      if (!options.generator) {
        return cli.showHelp()
      }

      return require('../')(options).run()
    }
  )
  .option('npm-client', {
    desc: `Use a specific npm client ('yarn' or 'npm')`,
    type: 'string'
  })
  .option('update', {
    desc: 'Update cached generator',
    type: 'boolean',
    alias: 'u'
  })
  .option('yes', {
    desc: 'Use the default options',
    alias: 'y'
  })

cli.on('error', error => {
  return require('..').handleError(error)
})

cli.parse()

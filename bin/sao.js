#!/usr/bin/env node
if (parseInt(process.versions.node, 10) < 8) {
  const chalk = require('chalk')
  console.error(
    chalk.red(
      `SAO requires Node.js version >= 8, please upgrade!\nCheck out ${chalk.underline('https://nodejs.org')}`
    )
  )
  process.exit(1)
}

const cac = require('cac').default

const cli = cac()

cli.command(
  '*',
  {
    alias: 'run',
    desc: 'Run a generator'
  },
  (input, flags) => {
    if (input.length === 0) {
      return cli.showHelp()
    }
    const Sao = require('../lib')
    const sao = new Sao(
      Object.assign(
        {
          from: input[0],
          outDir: input[1]
        },
        flags
      )
    )
    return sao.generate()
  }
).option('update', {
  desc: 'Update cached generator before running',
  alias: 'u'
})

cli.parse()

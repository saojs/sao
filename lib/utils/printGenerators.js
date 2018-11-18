const chalk = require('chalk')
const table = require('text-table')
const tildify = require('tildify')
const { repoPath, packagePath } = require('../paths')

function printGenerators({ packages, repos }) {
  console.log(
    chalk.cyan(
      `\n  Generators installed in ${tildify(packagePath)} from npm:\n`
    )
  )

  if (packages.length === 0) {
    console.log('  none')
  } else {
    console.log(
      table(
        packages.map(({ name, version }) => {
          return [`  ${name}`, chalk.dim(`v${version}`)]
        })
      )
    )
  }

  console.log(
    chalk.cyan(`\n  Generators installed in ${tildify(repoPath)} from git:\n`)
  )

  if (repos.length === 0) {
    console.log('  none')
  } else {
    console.log(
      table(
        repos.map(({ name, version }) => {
          return [`  ${name}`, chalk.dim(`v${version}`)]
        })
      )
    )
  }

  console.log()
}

module.exports = printGenerators

const path = require('path')
const chalk = require('chalk')
const installPackages = require('install-packages')
const logger = require('./logger')

module.exports = class GeneratorContext {
  constructor() {
    this.color = chalk
    this.logger = logger
  }

  async npmInstall({ packages, packageManager } = {}) {
    const spinner = require('./spinner').start(
      `Installing ${packages ? packages.join(', ') : 'packages'}...`
    )
    await installPackages({
      packages,
      logTitle: false,
      cwd: this.options.outDir,
      packageManager: packageManager || this.options.packageManager
    })
    spinner.stop()
  }

  determinePackageManager(cwd = this.options.outDir) {
    return installPackages.determinePackageManager(cwd)
  }

  gitInit() {
    return require('./utils/gitInit')(this.options.outDir)
  }

  showCompleteTips() {
    logger.success(
      chalk.bold(
        `Successfully generating into ${chalk.cyan(
          './' + path.relative(process.cwd(), this.options.outDir)
        )}`
      )
    )
    if (!this.options.inPlace) {
      logger.tip(
        chalk.bold(
          `To get started, run ${chalk.cyan(`cd ${this.options.outDirName}`)}`
        )
      )
    }
  }
}

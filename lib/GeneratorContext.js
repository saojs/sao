const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const spinner = require('./spinner')
const logger = require('./logger')
const SAOError = require('./SAOError')

module.exports = class GeneratorContext {
  constructor(sao, generator) {
    this.sao = sao
    this.generator = generator
    this.spinner = spinner
    this.chalk = chalk
    this.logger = logger
    this.fs = fs
  }

  get pkg() {
    try {
      return require(path.join(this.outDir, 'package.json'))
    } catch (err) {
      return {}
    }
  }

  get answers() {
    return this._answers
  }

  get gitUser() {
    return require('./gitInfo')(this.sao.opts.mock)
  }

  get outFolder() {
    return path.basename(this.sao.opts.outDir)
  }

  get outDir() {
    return this.sao.opts.outDir
  }

  get npmClient() {
    return require('./installPackages').getNpmClient()
  }

  gitInit() {
    const ps = spawn.sync('git', ['init'], {
      stdio: 'ignore',
      cwd: this.outDir
    })
    if (ps.status === 0) {
      logger.success('Initialized empty Git repository')
    } else {
      logger.debug(`git init failed in ${this.outDir}`)
    }
  }

  npmInstall(opts) {
    return require('./installPackages')(
      Object.assign(
        {
          registry: this.sao.opts.registry,
          cwd: this.outDir
        },
        opts
      )
    )
  }

  showProjectTips() {
    spinner.stop() // Stop when necessary
    logger.success(`Generated into ${chalk.underline(this.outDir)}`)
  }

  createError(message) {
    return new SAOError(message)
  }
}

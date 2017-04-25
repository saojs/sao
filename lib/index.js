'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const tildify = require('tildify')
const pathExists = require('path-exists')
const utils = require('./utils')
const download = require('./download')
const configUtils = require('./config-utils')
const event = require('./event')
const generate = require('./generate')
const mockPrompt = require('./mock-prompt')
const promptStore = require('./prompt-store')
const log = require('./log')

module.exports = co.wrap(function * ({
  template,
  targetPath = './',
  config: configFileName,
  install,
  removeStore,
  skipStore
} = {}) {
  const templateName = template.replace(/(#|@)[\s\S]+$/, '')

  // remove stored data
  if (removeStore) {
    promptStore.delete(`${utils.escapeDots(templateName)}`)
  }

  let dest

  if (utils.isLocalPath(template)) {
    dest = path.resolve(process.cwd(), template)
  } else if (utils.isRepo(template)) {
    const folderName = templateName.replace('/', '-')
    dest = path.join(configUtils.reposDir, folderName)

    const exists = yield pathExists(dest)
    if (!exists && !install) {
      install = yield utils.shouldInstallMissingTemplate(template)
    }

    if (install) {
      event.emit('download:start')
      yield download.repo(template, folderName)
      event.emit('download:stop')
    }
  } else {
    dest = utils.getGlobalPackage(`template-${templateName}`)

    const exists = yield pathExists(dest)
    if (!exists && !install) {
      install = yield utils.shouldInstallMissingTemplate(template)
    }

    let proc
    if (install) {
      event.emit('install-template:start', `template-${template}`)
      proc = require('yarn-install')([`template-${template}`], { stdio: 'pipe', global: true })
    }

    if (proc && (proc.status !== 0)) {
      log.error('Error occurs during installing package.\n\n' + chalk.red(proc.stderr.toString().trim()))
      if (exists) {
        log.warn(`Using cached npm package at ${tildify(dest)}`)
      }
    }
  }

  return yield generate({
    fromPath: dest,
    log: true,
    configFileName,
    targetPath,
    template,
    templateName,
    skipStore
  })
})

module.exports.generate = generate
module.exports.mockPrompt = mockPrompt

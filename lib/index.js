'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const tildify = require('tildify')
const pathExists = require('path-exists')
const npmInstall = require('yarn-install')
const utils = require('./utils')
const download = require('./download')
const configUtils = require('./config-utils')
const event = require('./event')
const generate = require('./generate')
const mockPrompt = require('./mock-prompt')
const promptStore = require('./prompt-store')
const log = require('./log')
const SAOError = require('./sao-error')

module.exports = co.wrap(function*(
  {
    template,
    targetPath = './',
    config: configFileName,
    install,
    removeStore,
    skipStore,
    forceNpm
  } = {}
) {
  if (template.charAt(0) === '@') {
    throw new SAOError(
      'SAO does not support scoped package for now! \n\nAnd every template from npm registry should be prefixed with `template-`'
    )
  }

  const templateName = template.replace(/(.+)[#@].+$/, '$1')

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

      const pm = npmInstall.getPm({ respectNpm5: forceNpm })
      log.info(
        `Since this template is a git repo, we're installing its dependencies with ${pm} now.`
      )
      npmInstall({ cwd: dest, production: true, respectNpm5: forceNpm })
    }
  } else {
    const packageName = `template-${templateName}`

    dest = utils.getGlobalPackage(packageName)
    const exists = yield pathExists(dest)
    if (!exists && !install) {
      install = yield utils.shouldInstallMissingTemplate(template)
    }

    let proc
    if (install) {
      const pm = npmInstall.getPm({ respectNpm5: forceNpm })
      event.emit('install-template:start', packageName, pm)
      proc = npmInstall([packageName], {
        stdio: 'pipe',
        global: true,
        respectNpm5: forceNpm
      })
    }

    if (proc && proc.status !== 0) {
      log.error(
        'Error occurs during installing package.\n\n' +
          chalk.red(proc.stderr.toString().trim())
      )
      if (exists) {
        log.warn(`Using cached npm package at ${tildify(dest)}`)
      }
    }

    // Run update notifier for package template
    utils.updateNotify(require(path.join(dest, 'package.json')))
  }

  return yield generate({
    fromPath: dest,
    log: true,
    configFileName,
    targetPath,
    template,
    templateName,
    skipStore,
    forceNpm
  })
})

module.exports.generate = generate
module.exports.mockPrompt = mockPrompt

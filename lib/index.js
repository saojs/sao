'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const tildify = require('tildify')
const pathExists = require('path-exists')
const npmInstall = require('yarn-install')
const generate = require('./generate')
const utils = require('./utils')
const download = require('./utils/download')
const configUtils = require('./utils/config')
const event = require('./utils/event')
const mockPrompt = require('./mock-prompt')
const log = require('./utils/log')
const parseTemplate = require('./utils/parse-template')
const SAOError = require('./utils/sao-error')

module.exports = co.wrap(function*(
  {
    template,
    targetPath = './',
    config: configFileName,
    install,
    removeStore,
    skipStore,
    forceNpm,
    clone,
    updateNotify
  } = {}
) {
  const parsed = parseTemplate(template)

  let dest
  let templatePkg

  if (parsed.type === 'local') {
    dest = parsed.path
    templatePkg = utils.readPkg(dest)
    configFileName = configUtils.getConfigFileName(configFileName, templatePkg)
  } else if (parsed.type === 'repo') {
    const folderName = `${parsed.user}::${parsed.name.replace('/', '-')}`
    dest = path.join(configUtils.reposDir, folderName)

    const exists = yield pathExists(dest)
    if (!exists && !install) {
      install = yield utils.shouldInstallMissingTemplate(parsed)
    }

    if (install) {
      event.emit('download:start')
      yield download.repo(parsed, dest, { clone })
      event.emit('download:stop')

      // Now template is downloaded
      // Read the template pkg and get config file name
      templatePkg = utils.readPkg(dest)
      configFileName = configUtils.getConfigFileName(
        configFileName,
        templatePkg
      )

      const repoHasConfig = yield pathExists(path.join(dest, configFileName))
      if (repoHasConfig) {
        const pm = npmInstall.getPm({ respectNpm5: forceNpm })
        log.info(
          `Since this template is a git repo, we're installing its dependencies with ${pm} now.`
        )
        npmInstall({ cwd: dest, production: true, respectNpm5: forceNpm })
      }
    } else {
      // Get template pkg and config file name from existing template
      templatePkg = utils.readPkg(dest)
      configFileName = configUtils.getConfigFileName(
        configFileName,
        templatePkg
      )
    }
  } else if (parsed.type === 'npm') {
    const packageName = parsed.scoped
      ? `@${parsed.user}/${parsed.name}`
      : parsed.name
    dest = utils.getGlobalPackage(packageName)

    const exists = yield pathExists(dest)
    if (!exists && !install) {
      install = yield utils.shouldInstallMissingTemplate(parsed)
    }

    let proc
    if (install) {
      const pm = npmInstall.getPm({ respectNpm5: forceNpm })
      event.emit('install-template:start', packageName, pm)
      const version = parsed.version ? `@${parsed.version}` : ''
      proc = npmInstall([`${packageName}${version}`], {
        stdio: 'pipe',
        global: true,
        respectNpm5: forceNpm
      })

      // Now template is downloaded
      // Read the template pkg and config file name
      templatePkg = utils.readPkg(dest)
      configFileName = configUtils.getConfigFileName(
        configFileName,
        templatePkg
      )

      if (proc.status !== 0) {
        log.error(
          'Error occurs during installing package.\n\n' +
            chalk.red(proc.stderr.toString().trim())
        )
        if (exists) {
          log.warn(`Using cached npm package at ${tildify(dest)}`)
        }
      }
    } else {
      // Read template pkg and config file name from existing template
      templatePkg = utils.readPkg(dest)
      configFileName = configUtils.getConfigFileName(
        configFileName,
        templatePkg
      )
    }
  }

  if (!(yield pathExists(dest))) {
    throw new SAOError(`template was not found at ${tildify(dest)}`)
  }

  if (parsed.type === 'npm' && updateNotify) {
    // Run update notifier for package template
    utils.updateNotify(templatePkg)
  }

  const templateVersion = templatePkg
    ? templatePkg.version
    : parsed.version ? parsed.version : ''

  return yield generate({
    fromPath: dest,
    log: true,
    configFileName,
    targetPath,
    store: {
      remove: removeStore,
      key: utils.escapeDots(`${dest}-${templateVersion}`),
      skipStored: skipStore
    },
    forceNpm
  })
})

module.exports.generate = generate
module.exports.mockPrompt = mockPrompt
module.exports.on = (...args) => event.on(...args)
module.exports.log = log

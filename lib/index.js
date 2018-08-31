'use strict'
const path = require('path')
const fs = require('fs-extra')
const co = require('co')
const tildify = require('tildify')
const npmInstall = require('yarn-install')
const semver = require('semver')
const filenamify = require('filenamify')
const generate = require('./generate')
const utils = require('./utils')
const download = require('./utils/download')
const configUtils = require('./utils/config')
const event = require('./utils/event')
const mockPrompt = require('./mock-prompt')
const log = require('./utils/log')
const parseTemplate = require('./utils/parse-template')
const SAOError = require('./utils/sao-error')

// eslint-disable-next-line complexity
module.exports = co.wrap(function*({
  template,
  configOptions,
  targetPath = './',
  config: configFileName,
  install,
  update,
  removeStore,
  skipStore,
  mockPrompts,
  forceNpm,
  clone,
  updateNotify,
  quite = false, // 静默模式
  registry = 'http://registry.npmjs.com'
} = {}) {
  global.disableSaoLog = !!quite

  // For backward compat
  if (typeof install === 'boolean') {
    console.warn('[sao] option "install" is deprecated, use "update" instead.')
    update = install
  }

  if (mockPrompts) {
    log.warn(
      'The yes flag has been set. This will automatically answer yes to all questions which may have security implications.'
    )
  }

  const parsed = parseTemplate(template)

  let dest
  let templatePkg

  if (parsed.type === 'local') {
    dest = parsed.path
    templatePkg = utils.readPkg(dest)
    configFileName = configUtils.getConfigFileName(configFileName, templatePkg)
  } else if (parsed.type === 'repo') {
    const folderName = filenamify(
      `${parsed.user}%%${parsed.name.replace('/', '-')}`
    )
    dest = path.join(configUtils.reposDir, folderName)
    const exists = yield fs.pathExists(dest)

    if (update || !exists) {
      yield configUtils.ensureRepos()

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

      const repoHasConfig = yield fs.pathExists(path.join(dest, configFileName))
      if (repoHasConfig) {
        if (
          templatePkg &&
          templatePkg.dependencies &&
          Object.keys(templatePkg.dependencies).length > 0
        ) {
          const pm = npmInstall.getPm({ respectNpm5: forceNpm })
          log.info(
            `Since this template is a git repo, we're installing its dependencies with ${pm} now.`
          )
          npmInstall({
            cwd: dest,
            production: true,
            respectNpm5: forceNpm,
            registry
          })
        }
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
    dest = utils.getPackageTemplatePath(packageName)

    // Check if existing package version matches expected package version
    const exists = yield fs.pathExists(dest)
    if (exists && parsed.version) {
      templatePkg = utils.readPkg(dest)
      if (!semver.satisfies(templatePkg.version, parsed.version)) {
        update = true
      }
    }

    let proc
    if (update || !exists) {
      yield configUtils.ensurePackages()

      const pm = npmInstall.getPm({ respectNpm5: forceNpm })
      event.emit('install-template:start', packageName, pm)
      const version = parsed.version ? `@${parsed.version}` : ''
      proc = npmInstall({
        deps: [`${packageName}${version}`],
        stdio: 'pipe',
        cwd: configUtils.packagesDir,
        respectNpm5: forceNpm,
        registry
      })

      // Now template is downloaded
      // Read the template pkg and config file name
      templatePkg = utils.readPkg(dest)
      configFileName = configUtils.getConfigFileName(
        configFileName,
        templatePkg
      )

      if (proc.status !== 0) {
        const msg =
          'Error occurs during installing package:\n' +
          proc.stderr.toString().trim()
        if (exists) {
          log.error(msg)
          log.warn(`Using cached npm package at ${tildify(dest)}`)
        } else {
          throw new SAOError(msg)
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

  if (!(yield fs.pathExists(dest))) {
    throw new SAOError(`template was not found at ${tildify(dest)}`)
  }

  if (parsed.type === 'npm' && updateNotify) {
    // Run update notifier for package template
    utils.updateNotify(templatePkg)
  }

  const templateVersion = templatePkg
    ? templatePkg.version
    : parsed.version || ''

  try {
    return yield generate({
      fromPath: dest,
      configOptions,
      log: true,
      configFileName,
      targetPath,
      store: {
        remove: removeStore,
        key: utils.escapeDots(`${dest}-${templateVersion}`),
        skipStored: skipStore
      },
      mockPrompts,
      forceNpm
    })
  } catch (err) {
    throw new SAOError(
      `template was damaged at ${tildify(
        dest
      )}, please remove this directory or use '--update' to run`
    )
  }
})

module.exports.generate = generate
module.exports.mockPrompt = mockPrompt
module.exports.on = (...args) => event.on(...args)
module.exports.log = log

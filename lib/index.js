'use strict'
const path = require('path')
const co = require('co')
const utils = require('./utils')
const download = require('./download')
const config = require('./config')
const event = require('./event')
const generate = require('./generate')

module.exports = co.wrap(function * ({
  template,
  targetFolder = './',
  gitCache,
  config: configFileName = 'sao',
  install
} = {}) {
  // initialize config folder
  config.ensureConfigDir()

  let dest

  if (utils.isLocalPath(template)) {
    dest = path.resolve(process.cwd(), template)
  } else if (utils.isRepo(template)) {
    const folderName = template.replace('/', '-')
    if (gitCache) {
      dest = path.join(config.reposDir, folderName)
      yield utils.checkIfRepoExists(dest, template)
    } else {
      event.emit('download:start')
      dest = yield download.repo(template, folderName)
      event.emit('download:stop')
    }
  } else {
    const packageName = `template-${template}`
    if (install) {
      event.emit('install-template:start', packageName)
      require('yarn-install')([packageName], {global: true})
    }
    dest = utils.getGlobalPackage(packageName)
    yield utils.checkIfPackageExists(dest, template)
  }

  return yield generate({fromPath: dest, configFileName, targetFolder})
})

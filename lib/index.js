'use strict'
const path = require('path')
const co = require('co')
const utils = require('./utils')
const download = require('./download')
const config = require('./config')
const event = require('./event')
const generate = require('./generate')
const promptStore = require('./prompt-store')

module.exports = co.wrap(function * ({
  template,
  targetFolder = './',
  config: configFileName = 'sao.js',
  install,
  reset
} = {}) {
  // initialize config folder
  config.ensureConfigDir()

  // reset stored data
  if (reset) {
    promptStore.delete(`${utils.escapeDots(template)}`)
  }

  let dest

  if (utils.isLocalPath(template)) {
    dest = path.resolve(process.cwd(), template)
  } else if (utils.isRepo(template)) {
    const folderName = template.replace('/', '-').replace(/#[\s\S]*$/, '')
    dest = path.join(config.reposDir, folderName)
    if (install) {
      event.emit('download:start')
      yield download.repo(template, folderName)
      event.emit('download:stop')
    }
    yield utils.checkIfRepoExists(dest, template)
  } else {
    const packageName = `template-${template}`
    if (install) {
      event.emit('install-template:start', packageName)
      require('yarn-install')([packageName], {global: true})
    }
    dest = utils.getGlobalPackage(packageName)
    yield utils.checkIfPackageExists(dest, template)
  }

  return yield generate({
    fromPath: dest,
    configFileName,
    targetFolder,
    template
  })
})

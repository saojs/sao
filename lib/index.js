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
  output = './',
  gitCache,
  config: configFileName = 'sao'
} = {}) {
  // initialize config folder
  config.ensureConfigDir()

  let dest

  if (utils.isRepo(template)) {
    const folderName = template.replace('/', '-')
    if (gitCache) {
      dest = path.join(config.reposDir, folderName)
    } else {
      event.emit('download:start')
      dest = yield download.repo(template, folderName)
      event.emit('download:stop')
    }
  } else {
    dest = utils.getGlobalPackage(`template-${template}`)
  }

  return yield generate({dest, configFileName, output})
})

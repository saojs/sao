'use strict'
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const home = require('user-home')
const pathExists = require('path-exists')

const configDir = path.join(home, '.sao')
const packagesDir = path.join(__dirname, '../../../')
const reposDir = path.join(configDir, 'repos')

function ensureConfigDir() {
  if (!fs.existsSync(reposDir)) {
    mkdirp.sync(reposDir)
  }
}

function getConfig(templateDir, configFileName) {
  const configPath = path.join(templateDir, configFileName)
  return pathExists(configPath).then(exists => {
    if (!exists) return null
    return require(configPath)
  })
}

exports.configDir = configDir
exports.packagesDir = packagesDir
exports.reposDir = reposDir
exports.ensureConfigDir = ensureConfigDir
exports.getConfig = getConfig

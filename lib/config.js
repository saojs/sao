'use strict'
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const home = require('user-home')

const configDir = path.join(home, '.sao')
const packagesDir = path.join(configDir, 'packages')
const reposDir = path.join(configDir, 'repos')

function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    mkdirp.sync(packagesDir)
    mkdirp.sync(reposDir)
  }
}

function getConfig(dir, configFileName) {
  try {
    return require(path.join(dir, configFileName))
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') return null
    throw err
  }
}

exports.configDir = configDir
exports.packagesDir = packagesDir
exports.reposDir = reposDir
exports.ensureConfigDir = ensureConfigDir
exports.getConfig = getConfig

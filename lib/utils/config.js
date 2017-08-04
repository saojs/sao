'use strict'
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const home = require('user-home')

const configDir = path.join(home, '.sao')
const packagesDir = path.join(__dirname, '../../../')
const reposDir = path.join(configDir, 'repos')

function ensureConfigDir() {
  if (!fs.existsSync(reposDir)) {
    mkdirp.sync(reposDir)
  }
}

function getConfig(dir, configFileName) {
  return new Promise((resolve, reject) => {
    const configPath = path.join(dir, configFileName)
    fs.exists(configPath, exists => {
      if (!exists) return resolve(null)
      try {
        resolve(require(configPath))
      } catch (err) {
        reject(err)
      }
    })
  })
}

exports.configDir = configDir
exports.packagesDir = packagesDir
exports.reposDir = reposDir
exports.ensureConfigDir = ensureConfigDir
exports.getConfig = getConfig

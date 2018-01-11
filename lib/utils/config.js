'use strict'
const path = require('path')
const fs = require('fs-extra')
const co = require('co')
const home = require('user-home')
const { getConfigOptions } = require('./')

const configDir = path.join(home, '.sao')
const packagesDir = path.join(configDir, 'packages')
const reposDir = path.join(configDir, 'repos')

const ensurePackages = co.wrap(function*() {
  const packagesDirExists = yield fs.pathExists(packagesDir)
  if (!packagesDirExists) {
    yield fs.ensureDir(packagesDir)
    yield fs.writeFile(
      path.join(packagesDir, 'package.json'),
      JSON.stringify({
        name: 'sao-package-templates',
        version: '0.0.0',
        private: true,
        license: 'MIT',
        dependencies: {}
      }),
      'utf8'
    )
  }
})

const ensureRepos = () => fs.ensureDir(reposDir)

function getConfig(templateDir, configFileName, context) {
  const configPath = path.join(templateDir, configFileName)
  return fs.pathExists(configPath).then(exists => {
    if (!exists) return null
    const config = require(configPath)
    return typeof config === 'function'
      ? config(getConfigOptions(context))
      : config
  })
}

function getConfigFileName(configFileName, pkg) {
  return configFileName || (pkg && pkg.sao) || 'sao.js'
}

exports.configDir = configDir
exports.packagesDir = packagesDir
exports.reposDir = reposDir
exports.getConfig = getConfig
exports.getConfigFileName = getConfigFileName
exports.ensurePackages = ensurePackages
exports.ensureRepos = ensureRepos

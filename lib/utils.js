'use strict'
const fs = require('fs')
const path = require('path')
const co = require('co')
const inq = require('inquirer')
const log = require('./log')
const configUtils = require('./config-utils')

/**
 * Check if a string is repo name
 * @param {string} input - Input string
 * @return {boolean} true: repo false: npm
 */
exports.isRepo = function (input) {
  return /.+\/.+/.test(input)
}

exports.getGlobalPackage = function (name) {
  return path.join(__dirname, '../../', name)
}

exports.isLocalPath = function (input) {
  return (input.charAt(0) === '.') || (input.charAt(0) === '/')
}

exports.requireAt = function (location, name) {
  return require(path.join(location, 'node_modules', name))
}

exports.escapeDots = function (str) {
  return str.replace(/\./g, '\\.')
}

exports.getTemplates = function () {
  const { packagesDir, reposDir } = configUtils
  return {
    packages: fs.readdirSync(packagesDir).filter(folder => folder.startsWith('template-')),
    repos: fs.readdirSync(reposDir)
  }
}

exports.readGlobalPackage = function (name) {
  return require(path.join(configUtils.packagesDir, name, 'package.json'))
}

exports.shouldInstallMissingTemplate = co.wrap(function * (template) {
  log.error(`You don’t seem to have a template with the name \`${template}\` installed.`)
  const { install } = yield inq.prompt([{
    name: 'install',
    message: 'Let SAO install missing template for you?',
    type: 'confirm',
    default: true
  }])
  return install
})

'use strict'
const path = require('path')
const co = require('co')
const inq = require('inquirer')
const globby = require('globby')
const update = require('update-notifier')
const log = require('./log')
const configUtils = require('./config')

exports.getGlobalPackage = function(name) {
  return path.join(__dirname, '../../../', name)
}

exports.requireAt = function(location, name) {
  return require(path.join(location, 'node_modules', name))
}

exports.escapeDots = function(str) {
  return str.replace(/\./g, '\\.')
}

exports.getTemplates = function() {
  const { packagesDir, reposDir } = configUtils

  return Promise.all([
    globby(['template-*', '@*/template-*'], { cwd: packagesDir }),
    globby(['*'], { cwd: reposDir }).then(folders =>
      folders.filter(folder => /::/.test(folder))
    )
  ])
}

exports.readGlobalPackage = function(name) {
  return require(path.join(configUtils.packagesDir, name, 'package.json'))
}

exports.shouldInstallMissingTemplate = co.wrap(function*(parsed) {
  if (parsed.type === 'repo') {
    log.warn(
      `You don't seem to have downloaded repo "${parsed.user}/${parsed.name}" on this machine.`
    )
  } else if (parsed.type === 'npm') {
    const name = parsed.scoped ? `@${parsed.user}/${parsed.name}` : parsed.name
    log.warn(
      `You don't seem to have npm package "${name}" installed on this machine.`
    )
  }

  const { install } = yield inq.prompt([
    {
      name: 'install',
      message: 'Let SAO install missing template for you?',
      type: 'confirm',
      default: true
    }
  ])

  return install
})

exports.updateNotify = function(pkg) {
  update({ pkg }).notify()
}

'use strict'
const path = require('path')
const fs = require('fs-extra')
const co = require('co')
const globby = require('globby')
const chalk = require('chalk')
const boxen = require('boxen')
const update = require('update-notifier')
const configUtils = require('./config')

exports.getPackageTemplatePath = function(name) {
  return path.join(configUtils.packagesDir, 'node_modules', name)
}

exports.requireAt = function(location, name) {
  return require(path.join(location, 'node_modules', name))
}

exports.escapeDots = function(str) {
  return str.replace(/\./g, '\\.')
}

exports.getTemplates = co.wrap(function*() {
  const { packagesDir, reposDir } = configUtils

  yield Promise.all([configUtils.ensurePackages(), configUtils.ensureRepos()])

  return yield Promise.all([
    fs
      .readFile(path.join(packagesDir, 'package.json'), 'utf8')
      .then(str => Object.keys(JSON.parse(str).dependencies)),
    globby(['*'], { cwd: reposDir }).then(folders =>
      folders.filter(folder => /%%/.test(folder))
    )
  ])
})

exports.readTemplatePkg = function(name) {
  return require(path.join(
    configUtils.packagesDir,
    'node_modules',
    name,
    'package.json'
  ))
}

exports.updateNotify = function(pkg) {
  const notifier = update({ pkg })
  if (notifier.update) {
    process.on('exit', () => {
      console.log(
        boxen(
          'Template update available ' +
            chalk.dim(notifier.update.current) +
            chalk.reset(' → ') +
            chalk.green(notifier.update.latest) +
            ' \nRun template with ' +
            chalk.cyan('--update') +
            ' flag to update'
        )
      )
    })
  }
}

exports.readPkg = function(dir) {
  try {
    return require(path.join(dir, 'package.json'))
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return null
    }
    throw err
  }
}

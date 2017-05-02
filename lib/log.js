'use strict'
const chalk = require('chalk')
const utils = require('./utils')

function log(msg, label, hasPrevious) {
  console.log(label, msg.trim())
}

exports.success = function (msg) {
  log(msg, chalk.green('SUCCESS'))
}

exports.error = function (msg) {
  log(msg, chalk.red('ERROR'))
}

exports.warn = function (msg) {
  log(msg, chalk.yellow('WARN'))
}

exports.info = function (msg) {
  log(msg, chalk.cyan('INFO'))
}

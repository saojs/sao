'use strict'
const chalk = require('chalk')

function log(msg, label) {
  console.log(label, msg)
}

exports.success = function(msg) {
  log(msg, chalk.green('SUCCESS'))
}

exports.error = function(msg) {
  log(msg, chalk.red('ERROR'))
}

exports.warn = function(msg) {
  log(msg, chalk.yellow('WARN'))
}

exports.info = function(msg) {
  log(msg, chalk.cyan('INFO'))
}

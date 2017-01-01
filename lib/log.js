'use strict'
const chalk = require('chalk')
const utils = require('./utils')

function log(msg, label, hasPrevious) {
  console.log(`${hasPrevious ? '' : '\n'}${utils.indent(`${label} ${msg.trim()}`)}\n`)
}

exports.success = function (msg, hasPrevious) {
  log(msg, chalk.bgGreen.black(' SUCCESS '), hasPrevious)
}

exports.error = function (msg, hasPrevious) {
  log(msg, chalk.bgRed.black(' ERROR '), hasPrevious)
}

exports.warn = function (msg, hasPrevious) {
  log(msg, chalk.bgYellow.black(' WARN '), hasPrevious)
}

exports.info = function (msg, hasPrevious) {
  log(msg, chalk.bgCyan.black(' INFO '), hasPrevious)
}

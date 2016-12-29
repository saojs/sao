'use strict'
const chalk = require('chalk')
const utils = require('./utils')

function log(msg, label) {
  console.log(`\n${utils.indent(`${label} ${msg.trim()}`)}\n`)
}

exports.success = function (msg) {
  log(msg, chalk.bgGreen.black(' SUCCESS '))
}

exports.error = function (msg) {
  log(msg, chalk.bgRed.black(' ERROR '))
}

exports.warn = function (msg) {
  log(msg, chalk.bgYellow.black(' WARN '))
}

exports.info = function (msg) {
  log(msg, chalk.bgCyan.black(' INFO '))
}

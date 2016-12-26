'use strict'
const path = require('path')

/**
 * Check if a string is repo name
 * @param {string} input - Input string
 * @return {boolean} true: repo false: npm
 */
exports.isRepo = function (input) {
  return input.indexOf('/') > -1
}

exports.getGlobalPackage = function (name) {
  return path.join(__dirname, '../../', name)
}

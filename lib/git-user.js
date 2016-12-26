'use strict'
const parseGitConfig = require('parse-git-config')
const gitConfigPath = require('git-config-path')

module.exports = function () {
  return parseGitConfig.sync({cwd: '/', path: gitConfigPath('global')}).user
}

'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const copy = require('kopy')
const config = require('./config')
const promptRole = require('./prompt-role')

module.exports = co.wrap(function * ({
  fromPath,
  configFileName,
  targetFolder,
  template
} = {}) {
  const projectConfig = yield config.getConfig(fromPath, configFileName, template)

  let skipInterpolation
  let prompts
  let filters
  let postAction

  if (projectConfig) {
    // skip rendering some files
    skipInterpolation = projectConfig.skipInterpolation
    // file filters
    filters = projectConfig.filters
    postAction = projectConfig.post

    // get data from prompts
    if (projectConfig.prompts) {
      if (Array.isArray(projectConfig.prompts)) {
        prompts = projectConfig.prompts
      } else {
        prompts = Object
          .keys(projectConfig.prompts)
          .map(name => Object.assign({
            name
          }, projectConfig.prompts[name]))
      }
      prompts = prompts.map(promptRole({targetFolder}))
    }
  }

  const templateFolder = projectConfig ? 'template' : './'

  return yield copy(path.join(fromPath, templateFolder), targetFolder, {
    engine: 'ejs',
    skipInterpolation,
    prompts,
    filters,
    clean: false
  }).then(files => {
    const context = {
      chalk,
      targetFolder
    }
    const action = postAction && postAction(context)
    if (action && action.then) return action.then(() => files)
    return files
  })
})

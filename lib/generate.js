'use strict'
const path = require('path')
const copy = require('kopy')
const config = require('./config')

module.exports = function ({
  dest,
  configFileName,
  output
} = {}) {
  const projectConfig = config.getConfig(dest, configFileName)

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
    }
  }

  return copy(path.join(dest, 'template'), output, {
    engine: 'ejs',
    skipInterpolation,
    prompts,
    filters
  }).then(files => {
    const action = postAction && postAction()
    if (action && action.then) return action.then(() => files)
    return files
  })
}

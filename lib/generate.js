'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const copy = require('kopy')
const $ = require('shelljs')
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
  let move

  if (projectConfig) {
    // skip rendering some files
    skipInterpolation = projectConfig.skipInterpolation
    // file filters
    filters = projectConfig.filters
    postAction = projectConfig.post
    // move files
    move = projectConfig.move

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
  const folderName = path.basename(path.resolve(process.cwd(), targetFolder))
  const templateContext = {
    folderName,
    isNewFolder: targetFolder !== './'
  }

  return yield copy(path.join(fromPath, templateFolder), targetFolder, {
    engine: 'ejs',
    skipInterpolation,
    prompts,
    data: {_: templateContext},
    filters,
    clean: false
  }).then(({files, data}) => {
    if (move) {
      for (const from in move) {
        $.mv(from, move[from])
      }
    }
    delete data._
    const actionContext = Object.assign({
      data,
      $,
      chalk
    }, templateContext)
    const action = postAction && postAction(actionContext)
    if (action && action.then) return action.then(() => files)
    return files
  })
})

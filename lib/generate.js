'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const copy = require('kopy')
const $ = require('shelljs')
const config = require('./config')
const promptRole = require('./prompt-role')
const SAOError = require('./sao-error')
const log = require('./log')

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
  let enforceType

  if (projectConfig) {
    // skip rendering some files
    skipInterpolation = projectConfig.skipInterpolation
    // file filters
    filters = projectConfig.filters
    postAction = projectConfig.post
    // move files
    move = projectConfig.move
    if (projectConfig.enforceNewFolder) {
      enforceType = 'new'
    } else if (projectConfig.enforceCurrentFolder) {
      enforceType = 'current'
    }

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
  if (templateContext.isNewFolder) {
    if (enforceType === 'current') {
      let msg = `template \`${template}\` requires you to initialize it in current working directory!\n`
      msg += `\n${chalk.dim(`> tip: You can try \`sao ${template}\` instead.`)}`
      throw new SAOError(msg)
    }
  } else if (enforceType === 'new') {
    let msg = `template \`${template}\` requires you to initialize it in a new folder!\n`
    msg += `\n${chalk.dim(`> tip: You can try \`sao ${template} <folder-name>\` instead.`)}`
    throw new SAOError(msg)
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
      chalk,
      log
    }, templateContext)
    const action = postAction && postAction(actionContext)
    if (action && action.then) return action.then(() => files)
    return files
  })
})

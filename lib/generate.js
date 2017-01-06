'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const copy = require('kopy')
const $ = require('shelljs')
const config = require('./config')
const handlePrompt = require('./handle-prompt')
const SAOError = require('./sao-error')
const log = require('./log')
const utils = require('./utils')
const promptStore = require('./prompt-store')

module.exports = co.wrap(function * ({
  fromPath,
  configFileName,
  targetFolder,
  template,
  templateName,
  skipStore
} = {}) {
  const projectConfig = yield config.getConfig(fromPath, configFileName, template)

  let skipInterpolation
  let prompts
  let filters
  let postAction
  let move
  let enforceType
  let templateEngine
  let templateOptions
  let templateFolder = './'

  if (projectConfig) {
    templateFolder = 'template'
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
    // get template engine
    if (projectConfig.template === 'handlebars') {
      templateEngine = require('jstransformer-handlebars')
    } else if (typeof projectConfig.template === 'string') {
      templateEngine = utils.requireAt(fromPath, `jstransformer-${projectConfig.template}`)
    } else {
      templateEngine = projectConfig.template
    }
    templateOptions = projectConfig.templateOptions

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
      prompts = prompts.map(handlePrompt({
        targetFolder,
        templateName,
        skipStore
      }))
    }
  }

  const folderPath = path.resolve(process.cwd(), targetFolder)
  const folderName = path.basename(folderPath)
  const isNewFolder = targetFolder !== './'
  const templateContext = {
    folderName,
    folderPath,
    isNewFolder
  }
  if (templateContext.isNewFolder) {
    if (enforceType === 'current') {
      let msg = `templateN \`${templateName}\` requires you to initialize it in current working directory!\n`
      msg += `\n${chalk.dim(`> tip: You can try \`sao ${template}\` instead.`)}`
      throw new SAOError(msg)
    }
  } else if (enforceType === 'new') {
    let msg = `template \`${templateName}\` requires you to initialize it in a new folder!\n`
    msg += `\n${chalk.dim(`> tip: You can try \`sao ${template} <folder-name>\` instead.`)}`
    throw new SAOError(msg)
  }

  return yield copy(path.join(fromPath, templateFolder), targetFolder, {
    template: templateEngine,
    templateOptions,
    skipInterpolation,
    prompts,
    data: {_: templateContext},
    filters,
    clean: false,
    // disable interpolation for regular git repo
    disableInterpolation: !projectConfig
  }).then(({files, answers}) => {
    // store data
    if (prompts) {
      for (const prompt of prompts) {
        if (prompt.store) {
          const answer = answers[prompt.name]
          if (answer !== undefined && answer !== '') {
            promptStore.set(`${utils.escapeDots(template)}.${prompt.name}`, answer)
          }
        }
      }
    }
    // move
    if (move) {
      for (const from in move) {
        $.mv(from, move[from])
      }
    }
    const actionContext = Object.assign({
      files,
      answers,
      $,
      chalk,
      log,
      install: () => {
        require('yarn-install')({cwd: folderPath})
      },
      init: () => {
        $.exec('git init', {cwd: folderPath})
      }
    }, templateContext)
    const action = postAction && postAction(actionContext)
    if (action && action.then) return action.then(() => files)

    if (!postAction) {
      // when there's no post action
      // it will sliently finished the process
      // so we add a default post action for such case
      log.success(`Successfully generated into ${chalk.yellow(folderName)}`)
      if (isNewFolder) {
        log.info(`cd ${chalk.yellow(folderName)} to get started!`, true)
      }
    }

    return files
  })
})

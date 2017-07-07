'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const copy = require('kopy')
const $ = require('shelljs')
const pathExists = require('path-exists')
const configUtils = require('./config-utils')
const handlePrompt = require('./handle-prompt')
const SAOError = require('./sao-error')
const log = require('./log')
const utils = require('./utils')
const promptStore = require('./prompt-store')

module.exports = co.wrap(function*(
  {
    fromPath,
    configFileName = 'sao.js',
    targetPath,
    template,
    templateName,
    skipStore,
    log: printLogs,
    mockPromptData,
    write
  } = {}
) {
  let projectConfig

  const templateExists = yield pathExists(fromPath)

  if (!templateExists) {
    throw new SAOError(`Template path "${fromPath}" does not exist!`)
  }

  if (/^https?:\/\//.test(configFileName)) {
    const spinner = require('ora')('Downloading config...').start()
    try {
      projectConfig = yield require('./fetch-remote-config')(configFileName)
      spinner.stop()
    } catch (err) {
      spinner.stop()
      throw new SAOError(err.message)
    }
  } else if (configFileName) {
    projectConfig = yield configUtils.getConfig(fromPath, configFileName)
  }

  let skipInterpolation
  let prompts
  let filters
  let postAction
  let enforceType
  let templateEngine
  let templateOptions
  let templateFolder = './'
  let move
  let data // mock prompt data
  let installDependencies
  let gitInit
  let showTip

  if (projectConfig) {
    templateFolder = projectConfig.templateFolder || 'template'
    // skip rendering some files
    skipInterpolation = projectConfig.skipInterpolation
    // file filters
    filters = projectConfig.filters
    installDependencies = projectConfig.installDependencies
    gitInit = projectConfig.gitInit
    showTip = projectConfig.showTip
    // move files
    move = projectConfig.move
    postAction = projectConfig.post || projectConfig.complete
    if (projectConfig.enforceNewFolder) {
      enforceType = 'new'
    } else if (projectConfig.enforceCurrentFolder) {
      enforceType = 'current'
    }
    // get template engine
    if (projectConfig.template === 'handlebars') {
      templateEngine = require('jstransformer-handlebars')
    } else if (typeof projectConfig.template === 'string') {
      templateEngine = utils.requireAt(
        fromPath,
        `jstransformer-${projectConfig.template}`
      )
    } else {
      templateEngine = projectConfig.template
    }
    templateOptions = projectConfig.templateOptions

    // get data from prompts
    if (projectConfig.prompts) {
      if (Array.isArray(projectConfig.prompts)) {
        prompts = projectConfig.prompts
      } else {
        prompts = Object.keys(projectConfig.prompts).map(name =>
          Object.assign(
            {
              name
            },
            projectConfig.prompts[name]
          )
        )
      }

      prompts = prompts.map(
        handlePrompt({
          targetPath,
          templateName,
          skipStore
        })
      )

      if (mockPromptData) {
        data = {}
        prompts.forEach(prompt => {
          if (Object.hasOwnProperty.call(mockPromptData, prompt.name)) {
            data[prompt.name] = mockPromptData[prompt.name]
            if (
              typeof prompt.validate === 'function' &&
              !prompt.validate(data[prompt.name], data)
            ) {
              throw new SAOError(`Validation failed at "${prompt.name}"`)
            }
          } else {
            data[prompt.name] = typeof prompt.default === 'function'
              ? prompt.default(data)
              : prompt.default
          }
        })
        prompts = undefined
      }
    }
  }

  const folderPath = path.resolve(process.cwd(), targetPath)
  const folderName = path.basename(folderPath)
  const isNewFolder = targetPath !== './'
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

  return yield copy(path.join(fromPath, templateFolder), targetPath, {
    template: templateEngine,
    templateOptions,
    skipInterpolation,
    prompts,
    data: Object.assign({ _: templateContext }, data),
    filters,
    move,
    clean: false,
    write,
    // disable interpolation for regular git repo
    disableInterpolation: !projectConfig
  }).then(stream => {
    // store data
    if (prompts) {
      for (const prompt of prompts) {
        if (prompt.store) {
          const answer = stream.meta.answers[prompt.name]
          if (answer !== undefined && answer !== '') {
            promptStore.set(
              `${utils.escapeDots(template)}.${prompt.name}`,
              answer
            )
          }
        }
      }
    }

    if (!printLogs) return stream

    const context = Object.assign(
      {},
      {
        $,
        chalk,
        log,
        install: () => {
          require('yarn-install')({ cwd: folderPath })
        },
        init: () => {
          $.exec('git init', { cwd: folderPath })
        },
        showTip: () => {
          log.success('Done, let the hacking begin!')
          if (isNewFolder) {
            log.info(`cd ${chalk.yellow(folderName)} to get started!`)
          }
        }
      },
      templateContext
    )

    if (gitInit) {
      context.init()
    }
    if (installDependencies) {
      context.install()
    }

    const action = postAction && postAction(context, stream)
    if (action && action.then) return action.then(() => stream)

    if (!postAction || showTip) {
      // when there's no post action
      // it will sliently finished the process
      // so we add a default post action for such case
      log.success(`Successfully generated into ${chalk.yellow(folderName)}`)
      if (isNewFolder) {
        log.info(`cd ${chalk.yellow(folderName)} to get started!`)
      }
    }

    return stream
  })
})

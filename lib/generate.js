'use strict'
const path = require('path')
const co = require('co')
const chalk = require('chalk')
const copy = require('kopy')
const $ = require('shelljs')
const npmInstall = require('yarn-install')
const pathExists = require('path-exists')
const configUtils = require('./utils/config')
const handlePrompt = require('./utils/handle-prompt')
const SAOError = require('./utils/sao-error')
const log = require('./utils/log')
const utils = require('./utils')
const promptStore = require('./utils/prompt-store')

module.exports = co.wrap(function*(
  {
    fromPath,
    configFileName = 'sao.js',
    targetPath,
    store,
    log: printLogs = true,
    mockPromptData,
    write,
    forceNpm
  } = {}
) {
  if (store && store.remove) {
    promptStore.delete(store.key)
  }

  const templateExists = yield pathExists(fromPath)

  if (!templateExists) {
    throw new SAOError(`Template path "${fromPath}" does not exist!`)
  }

  const projectConfig = yield configUtils.getConfig(fromPath, configFileName)

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
  let npmInstallDeps
  let yarnInstallDeps
  let gitInit
  let showTip

  if (projectConfig) {
    templateFolder = projectConfig.templateFolder || 'template'
    // skip rendering some files
    skipInterpolation = projectConfig.skipInterpolation
    // file filters
    filters = projectConfig.filters
    // refactor: remove `installDependencies` option
    yarnInstallDeps =
      projectConfig.installDependencies || projectConfig.yarnInstall
    npmInstallDeps = projectConfig.npmInstall
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
          store
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
            data[prompt.name] =
              typeof prompt.default === 'function'
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
  const isNewFolder = folderPath !== process.cwd()
  const templateContext = {
    folderName,
    folderPath,
    isNewFolder,
    pm: npmInstall.getPm({ respectNpm5: forceNpm })
  }
  if (templateContext.isNewFolder) {
    if (enforceType === 'current') {
      const msg = `You have to initialize this template in current working directory!\n`
      throw new SAOError(msg, 'REQUIRE_CURRENT_FOLDER')
    }
  } else if (enforceType === 'new') {
    const msg = `You have to initialize this template in a new folder!\n`
    throw new SAOError(msg, 'REQUIRE_NEW_FOLDER')
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
        if (prompt.store && store) {
          const answer = stream.meta.answers[prompt.name]
          if (answer !== undefined && answer !== '') {
            promptStore.set(`${store.key}.${prompt.name}`, answer)
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
        answers: stream.meta.answers,
        // yarn > npm@*
        install: () => {
          require('yarn-install')({
            cwd: folderPath,
            respectNpm5: forceNpm
          })
        },
        // npm 5+ > yarn > npm 4-
        npmInstall: () => {
          require('yarn-install')({
            cwd: folderPath,
            respectNpm5: typeof forceNpm === 'boolean' ? forceNpm : true
          })
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

    // refactor: remove context.install
    context.yarnInstall = context.install
    context.gitInit = context.init

    if (gitInit) {
      context.init()
    }
    if (yarnInstallDeps) {
      context.yarnInstall()
    } else if (npmInstallDeps) {
      context.npmInstall()
    }

    const action = postAction && postAction(context, stream)
    if (action && action.then) return action.then(() => stream)

    if (!postAction || showTip) {
      // when there's no post action
      // it will sliently finished the process
      // so we add a default post action for such case
      if (!projectConfig) {
        log.warn('Config file was not found, treat as regular folder!')
      }
      log.success(`Successfully generated into ${chalk.yellow(folderName)}`)
      if (isNewFolder) {
        log.info(`cd ${chalk.yellow(folderName)} to get started!`)
      }
    }

    return stream
  })
})

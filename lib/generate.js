'use strict'
const path = require('path')
const co = require('co')
const fs = require('fs-extra')
const chalk = require('chalk')
const kopy = require('kopy')
const spawn = require('cross-spawn')
const npmInstall = require('yarn-install')
const configUtils = require('./utils/config')
const handlePrompt = require('./utils/handle-prompt')
const SAOError = require('./utils/sao-error')
const log = require('./utils/log')
const utils = require('./utils')
const promptStore = require('./utils/prompt-store')

// eslint-disable-next-line complexity
module.exports = co.wrap(function*({
  fromPath,
  configFileName = 'sao.js',
  targetPath,
  store,
  log: printLogs = true,
  mockPrompts,
  write = true,
  forceNpm,
  configOptions
} = {}) {
  if (store && store.remove) {
    promptStore.delete(store.key)
  }

  const templateExists = yield fs.pathExists(fromPath)

  if (!templateExists) {
    throw new SAOError(`Template path "${fromPath}" does not exist!`)
  }

  const projectConfig = yield configUtils.getConfig(
    fromPath,
    configFileName,
    configOptions
  )

  const folderPath = path.resolve(process.cwd(), targetPath)
  const folderName = path.basename(folderPath)
  const isNewFolder = folderPath !== process.cwd()

  const templateContext = {
    folderName,
    folderPath,
    isNewFolder,
    pm: npmInstall.getPm({ respectNpm5: forceNpm })
  }

  const showTip = () => {
    if (!printLogs) return

    log.success('Done, let the hacking begin!')
    if (isNewFolder) {
      log.info(
        `Type \`cd ${chalk.yellow(
          path.relative(process.cwd(), folderPath)
        )}\` to get started!`
      )
    }
  }

  if (!projectConfig) {
    if (printLogs) {
      log.warn('Config file was not found, we simply copy it to dest folder!')
    }
    return kopy(fromPath, targetPath, {
      write,
      clean: false,
      disableInterpolation: true
    }).then(stream => {
      showTip()
      return stream
    })
  }

  const enforceType = projectConfig.enforceNewFolder
    ? 'new'
    : projectConfig.enforceCurrentFolder ? 'current' : null

  if (templateContext.isNewFolder) {
    if (enforceType === 'current') {
      const msg = `You have to initialize this template in current working directory!`
      throw new SAOError(msg, 'REQUIRE_CURRENT_FOLDER')
    }
  } else if (enforceType === 'new') {
    const msg = `You have to initialize this template in a new folder!`
    throw new SAOError(msg, 'REQUIRE_NEW_FOLDER')
  }

  const kopyOptions = {
    templateOptions: projectConfig.templateOptions,
    skipInterpolation: projectConfig.skipInterpolation,
    filters: projectConfig.filters,
    move: projectConfig.move,
    clean: false,
    data(answers) {
      const templateData =
        typeof projectConfig.data === 'function'
          ? projectConfig.data(answers)
          : projectConfig.data
      return Object.assign({}, templateData, { _: templateContext })
    },
    mockPrompts,
    write
  }

  // get template engine
  if (projectConfig.template === 'handlebars') {
    kopyOptions.template = require('jstransformer-handlebars')
  } else if (typeof projectConfig.template === 'string') {
    kopyOptions.template = utils.requireAt(
      fromPath,
      `jstransformer-${projectConfig.template}`
    )
  } else {
    kopyOptions.template = projectConfig.template
  }

  // get data from prompts
  if (projectConfig.prompts) {
    if (Array.isArray(projectConfig.prompts)) {
      kopyOptions.prompts = projectConfig.prompts
    } else {
      kopyOptions.prompts = Object.keys(projectConfig.prompts).map(name =>
        Object.assign(
          {
            name
          },
          projectConfig.prompts[name]
        )
      )
    }

    kopyOptions.prompts = kopyOptions.prompts.map(
      handlePrompt({
        targetPath,
        store
      })
    )
  }

  return yield kopy(
    path.join(fromPath, projectConfig.templateFolder || 'template'),
    targetPath,
    kopyOptions
  ).then(stream => {
    if (!printLogs) return stream

    const { prompts } = kopyOptions
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

    const context = Object.assign(
      {},
      {
        chalk,
        log,
        answers: stream.meta.answers,
        // yarn > npm@*
        yarnInstall: (deps, options) => {
          npmInstall(
            Object.assign({}, options, {
              deps,
              cwd: folderPath,
              respectNpm5: forceNpm
            })
          )
        },
        // npm 5+ > yarn > npm 4-
        npmInstall: (deps, options) => {
          npmInstall(
            Object.assign({}, options, {
              deps,
              cwd: folderPath,
              respectNpm5: typeof forceNpm === 'boolean' ? forceNpm : true
            })
          )
        },
        gitInit: () => {
          const proc = spawn.sync('git', ['init'], {
            cwd: folderPath,
            stdio: 'inherit'
          })
          if (proc.error && proc.error.code === 'ENOENT') {
            log.warn(
              `${chalk.bold(
                'git'
              )} was not installed on this machine, therefore \`git init\` was skipped.`
            )
          }
        },
        showTip
      },
      templateContext
    )

    // refactor: remove context.install
    context.install = context.yarnInstall
    context.init = context.gitInit

    if (projectConfig.gitInit) {
      context.init()
    }
    if (projectConfig.yarnInstall || projectConfig.installDependencies) {
      context.yarnInstall()
    } else if (projectConfig.npmInstall) {
      context.npmInstall()
    }

    const complete = projectConfig.complete || projectConfig.post
    const completeResult = complete && complete(context, stream)
    if (completeResult && completeResult.then) {
      return completeResult.then(() => stream)
    }

    if (!complete || projectConfig.showTip) {
      showTip()
    }

    return stream
  })
})

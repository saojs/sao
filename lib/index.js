const path = require('path')
const chalk = require('chalk')
const invokeActions = require('./invokeActions')
const parseGenerator = require('./utils/parseGenerator')
const logger = require('./logger')
const evaluate = require('./utils/evaluate')
const { escapeDots } = require('./utils')

module.exports = class SAO {
  constructor(options) {
    this.logger = logger
    this.options = this.normalizeOptions(options)
    this.color = require('chalk')
    this.npmInstall = async ({ packages, packageManager } = {}) => {
      const spinner = require('./spinner').start(
        `Installing ${packages ? packages.join(', ') : 'packages'}...`
      )
      await require('install-packages')({
        packages,
        logTitle: false,
        cwd: this.options.outDir,
        packageManager: packageManager || this.options.packageManager
      })
      spinner.stop()
    }
    this.gitInit = () => {
      return require('./utils/gitInit')(this.options.outDir)
    }
    this.showCompleteTips = () => {
      logger.success(
        chalk.bold(
          `Successfully generating into ${chalk.green(
            path.relative(process.cwd(), this.options.outDir)
          )}`
        )
      )
      if (!this.options.inPlace) {
        logger.tip(
          chalk.bold(
            `To get started, run ${chalk.cyan(`cd ${this.options.outDirName}`)}`
          )
        )
      }
    }
  }

  normalizeOptions(options = {}) {
    const outDir = path.resolve(options.outDir || '.')
    const logLevel = options.logLevel
    if (typeof logLevel === 'number') {
      this.logger.setOptions({ logLevel })
    }
    return {
      baseDir: options.baseDir || process.cwd(),
      from: options.from,
      outDir,
      outDirName: path.basename(outDir),
      inPlace: outDir === process.cwd(),
      // Update cached generator first
      update: options.update,
      packageManager: options.npm ? 'npm' : null,
      mock: options.mock,
      skipInstall: options.skipInstall,
      skipCache: options.skipCache,
      logLevel
    }
  }

  static async mockPrompt(from, answers, subAnswers) {
    const sao = new SAO({
      from,
      outDir: path.join(
        require('os').tmpdir(),
        require('crypto').randomBytes(20).toString('hex'),
        `sao-temp`
      ),
      logLevel: 1,
      mock: {
        answers,
        subAnswers
      }
    })

    const TestHelper = require('./TestHelper')
    return new TestHelper(sao).run()
  }

  async generate({ from = this.options.from, baseDir, parentName, name } = {}) {
    const actualGenerator = await this.getGenerator(
      from,
      baseDir,
      name,
      parentName
    )

    if (!actualGenerator) {
      return logger.error('No generator was found!')
    }

    const { generatorPath, config, generatorName, storeKey } = actualGenerator

    const beforeGenerators = []
    const afterGenerators = []
    if (config.generators) {
      for (const g of config.generators) {
        if (g.invoke) {
          if (g.invoke === 'after') {
            afterGenerators.push(g)
          } else {
            beforeGenerators.push(g)
          }
        }
      }
    }

    if (beforeGenerators.length > 0) {
      await this.runGenerators(
        beforeGenerators,
        generatorPath,
        name || generatorName
      )
    }

    const callWithContext = target => {
      return typeof target === 'function' ? target.call(this, this) : target
    }

    if (config.prompts) {
      let prompts = config.prompts
      if (!Array.isArray(prompts) && typeof prompts === 'object') {
        prompts = Object.keys(prompts).map(name =>
          Object.assign({ name }, prompts[name])
        )
      }
      prompts = await Promise.all(
        callWithContext(config.prompts).map(async prompt => {
          if (typeof prompt.when === 'string') {
            const when = prompt.when
            prompt.when = answers => evaluate(when, answers)
          }
          if (prompt.store && !this.options.skipCache) {
            const stored = require('./promptStore').get(
              `${storeKey}.${prompt.name}`
            )
            if (stored !== undefined) {
              prompt.default = stored
            }
          }
          if (typeof prompt.default === 'string') {
            prompt.default = prompt.default
              .replace('[folderName]', this.options.outDirName)
              .replace('[folderPath]', this.options.outDir)

            const gitUserRe = /^\[gitUser\]$/
            const gitEmailRe = /^\[gitEmail\]$/
            if (
              gitUserRe.test(prompt.default) ||
              gitEmailRe.test(prompt.default)
            ) {
              const gitInfo = await require('./utils/gitInfo')()
              prompt.default = prompt.default
                .replace(gitUserRe, gitInfo.user)
                .replace(gitEmailRe, gitInfo.email)
            }
          }
          return prompt
        })
      )
      if (this.options.mock) {
        this.answers = {}
        for (const prompt of prompts) {
          this.answers[prompt.name] = typeof prompt.default === 'function' ? prompt.default(this.answers) : prompt.default
        }

        if (parentName) {
          for (const name of Object.keys(this.options.mock.subAnswers)) {
            const g = await this.getGenerator(name)
            if (g.generatorPath === generatorPath) {
              Object.assign(this.answers, this.options.mock.subAnswers[name])
              break
            }
          }
        } else {
          Object.assign(this.answers, this.options.mock.answers)
        }
      } else {
        this.answers = await require('inquirer').prompt(prompts)

        // Prevent variable is undefined error in ejs template
        for (const prompt of prompts) {
          if (!this.answers.hasOwnProperty(prompt.name)) {
            this.answers[prompt.name] = undefined
          }
        }
      }

      if (!this.options.skipCache) {
        Object.keys(this.answers).forEach(key => {
          const prompt = prompts.find(p => p.name === key)
          if (prompt && prompt.store) {
            require('./promptStore').set(`${storeKey}.${key}`, this.answers[key])
          }
        })
      }
    }
    if (config.actions) {
      const actions = callWithContext(config.actions)
        .map(action => {
          if (typeof action.when === 'string') {
            action.when = evaluate(action.when, this.answers)
          } else if (typeof action.when === 'function') {
            action.when = action.when(this.answers)
          } else {
            action.when = action.when === undefined ? true : action.when
          }
          return action
        })
        .filter(action => action.when)
      await invokeActions(actions, {
        generatorPath,
        templateDir: config.templateDir,
        outDir: this.options.outDir,
        context: this,
        config
      })
    }

    if (afterGenerators.length > 0) {
      await this.runGenerators(
        afterGenerators,
        generatorPath,
        name || generatorName
      )
    }

    if (config.complete && !this.options.mock) {
      try {
        await callWithContext(config.complete)
      } catch (err) {
        // In case spinner is not stopped
        require('./spinner').stop()
        throw err
      }
    }
  }

  async runGenerators(generators, generatorPath, parentName) {
    for (const generator of generators) {
      await this.generate({
        from: generator.from,
        baseDir: generatorPath,
        name: generator.name,
        parentName
      })
    }
  }

  async getGenerator(from, baseDir, name, parentName) {
    const generator = parseGenerator(from)

    if (parentName && (name || from)) {
      logger.info(
        `${chalk.bold('Using sub generator:')} ${`${chalk.bold(
          parentName
        )} ${chalk.dim(':')} `}${chalk.bold(`${name || from}`)}`
      )
    }

    let generatorPath
    let storeKey
    if (generator.type === 'local') {
      generatorPath = path.resolve(baseDir || '.', generator.path)
      storeKey = generatorPath
    } else if (generator.type === 'npm') {
      generatorPath = await require('./ensurePackage')(generator.module, {
        forceInstall: this.options.update,
        packageManager: this.options.packageManager
      })
      storeKey = generatorPath + ':' + (generator.version || '')
    } else if (generator.type === 'git') {
      generatorPath = await require('./ensureRepo')({
        repo: generator.repo,
        user: generator.user,
        version: generator.version,
        clone: this.options.clone,
        forceDownload: this.options.update,
        packageManager: this.options.packageManager
      })
      storeKey = generatorPath + ':' + (generator.version || '')
    }

    let config
    try {
      config = require(path.join(generatorPath, 'saofile.js'))
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        config = require('./defaultSAOFile')
      } else {
        throw err
      }
    }

    if (!this.options.mock && generator.type === 'npm') {
      const pkg = require(path.join(generatorPath, 'package.json'))
      const notifier = require('update-notifier')({
        pkg,
        updateCheckInterval: 10
      })

      if (pkg.description) {
        logger.info(pkg.description)
      }

      if (notifier.update) {
        logger.warn(
          `Generator update available! ${chalk.dim(
            notifier.update.current
          )} -> ${chalk.green(notifier.update.latest)}`
        )
        logger.warn(
          `Run this generator with ${chalk.cyan('--update')} or ${chalk.cyan(
            '-u'
          )} flag to update.`
        )
        process.exit()
      }
    }

    if (generator.generator) {
      let actualGenerator
      for (const subGeneratorName of generator.generator) {
        const subGenerator = config.generators.find(
          g => g.name === subGeneratorName
        )
        if (subGenerator) {
          actualGenerator = this.getGenerator(
            subGenerator.from,
            generatorPath,
            subGenerator.name,
            generator.name
          )
        }
      }

      return actualGenerator
    }

    config.templateDir = config.templateDir || 'template'

    return {
      generatorPath,
      config,
      generatorName: generator.name,
      storeKey: escapeDots(storeKey)
    }
  }
}

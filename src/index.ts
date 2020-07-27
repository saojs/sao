import { tmpdir } from 'os'
import path from 'path'
import { SetRequired } from 'type-fest'
import resolveFrom from 'resolve-from'
import { glob } from 'majo'
import spawn from 'cross-spawn'
import { loadGeneratorConfig, GeneratorConfig } from './generator-config'
import { logger } from './logger'
import { isLocalPath } from './utils/is-local-path'
import { SAOError, handleError } from './error'
import { parseGenerator, ParsedGenerator } from './parse-generator'
import { updateCheck } from './update-check'
import { store } from './store'
import {
  ensureRepo,
  ensurePackage,
  ensureLocal,
} from './utils/ensure-generator'
import { defautSaoFile } from './default-saofile'
import { readFile, pathExists } from './utils/fs'
import { spinner } from './spinner'
import { colors } from './utils/colors'
import { GitUser, getGitUser } from './utils/git-user'
import {
  NPM_CLIENT,
  getNpmClient,
  InstallOptions,
  installPackages,
} from './install-packages'
import { GeneratorList, generatorList } from './utils/generator-list'

export interface Options {
  outDir?: string
  logLevel?: number
  debug?: boolean
  quiet?: boolean
  generator: string
  /** Update cached generator before running */
  update?: boolean
  /** Use `git clone` to download repo */
  clone?: boolean
  /** Use a custom npm registry */
  registry?: string
  /** Check for sao/generator updates */
  updateCheck?: boolean
  /** Mock git info, prompts etc */
  mock?: boolean
  /**
   * User-supplied answers
   * `true` means using default answers for prompts
   */
  answers?:
    | boolean
    | {
        [k: string]: any
      }
}

const EMPTY_ANSWERS = Symbol()
const EMPTY_DATA = Symbol()

export class SAO {
  opts: SetRequired<Options, 'outDir' | 'logLevel'>
  spinner = spinner
  colors = colors
  logger = logger

  private _answers: { [k: string]: any } | symbol = EMPTY_ANSWERS
  private _data: { [k: string]: any } | symbol = EMPTY_DATA

  parsedGenerator: ParsedGenerator
  generatorList: GeneratorList

  constructor(opts: Options) {
    this.opts = {
      ...opts,
      outDir: path.resolve(opts.outDir || '.'),
      logLevel: opts.logLevel || 3,
      mock:
        typeof opts.mock === 'boolean'
          ? opts.mock
          : process.env.NODE_ENV === 'test',
    }

    if (opts.debug) {
      this.opts.logLevel = 4
    } else if (opts.quiet) {
      this.opts.logLevel = 1
    }

    logger.setOptions({
      logLevel: this.opts.logLevel,
      mock: this.opts.mock,
    })

    if (this.opts.mock) {
      this.opts.outDir = path.join(tmpdir(), `sao-out/${Date.now()}/out`)
    }

    if (this.opts.mock && typeof this.opts.answers === 'undefined') {
      this.opts.answers = true
    }

    this.generatorList = generatorList
    this.parsedGenerator = parseGenerator(this.opts.generator)

    // Sub generator can only be used in an existing
    if (this.parsedGenerator.subGenerator && !this.opts.mock) {
      logger.debug(
        `Setting out directory to process.cwd() since it's a sub generator`
      )
      this.opts.outDir = process.cwd()
    }
  }

  /**
   * Get the help message for current generator
   *
   * Used by SAO CLI, in general you don't want to touch this
   */
  async getGeneratorHelp(): Promise<string> {
    const { config } = await this.getGenerator()

    let help = ''

    if (config.description) {
      help += `\n${config.description}`
    }

    return help
  }

  /**
   * Get actual generator to run and its config
   * Download it if not yet cached
   */
  async getGenerator(
    generator: ParsedGenerator = this.parsedGenerator,
    hasParent?: boolean
  ): Promise<{ generator: ParsedGenerator; config: GeneratorConfig }> {
    if (generator.type === 'repo') {
      await ensureRepo(generator, {
        update: this.opts.update,
        clone: this.opts.clone,
        registry: this.opts.registry,
      })
    } else if (generator.type === 'npm') {
      await ensurePackage(generator, this.opts)
    } else if (generator.type === 'local') {
      await ensureLocal(generator)
    }

    if (!hasParent) {
      this.generatorList.add(generator)
    }

    logger.debug(`Loaded generator from ${generator.path}`)

    const loaded = await loadGeneratorConfig(generator.path)
    const config: GeneratorConfig =
      loaded.path && loaded.data ? loaded.data : defautSaoFile

    // Only run following code for root generator
    if (!hasParent) {
      if (this.opts.updateCheck) {
        updateCheck({
          generator,
          checkGenerator:
            config.updateCheck !== false && generator.type === 'npm',
          // Don't show the notifier after updated the generator
          // Since the notifier is for the older version
          showNotifier: !this.opts.update,
        })
      }
      // Keep the generator info
      store.set(`generators.${generator.hash}`, generator)
    }

    if (generator.subGenerator && config.subGenerators) {
      const subGenerator = config.subGenerators.find(
        (g) => g.name === generator.subGenerator
      )
      if (subGenerator) {
        let generatorPath = subGenerator.generator
        generatorPath = isLocalPath(generatorPath)
          ? path.resolve(generator.path, generatorPath)
          : resolveFrom(generator.path, generatorPath)
        return this.getGenerator(parseGenerator(generatorPath), true)
      }
      throw new SAOError(`No such sub generator in generator ${generator.path}`)
    }

    return {
      generator,
      config,
    }
  }

  async runGenerator(
    generator: ParsedGenerator,
    config: GeneratorConfig
  ): Promise<void> {
    if (config.description) {
      logger.status('green', 'Generator', config.description)
    }

    if (typeof config.prepare === 'function') {
      await config.prepare.call(this, this)
    }

    if (config.prompts) {
      const { runPrompts } = await import('./run-prompts')
      await runPrompts(config, this)
    } else {
      this._answers = {}
    }

    this._data = config.data ? config.data.call(this, this) : {}

    if (config.actions) {
      const { runActions } = await import('./run-actions')
      await runActions(config, this)
    }

    if (!this.opts.mock && config.completed) {
      await config.completed.call(this, this)
    }
  }

  async run(): Promise<void> {
    const { generator, config } = await this.getGenerator()
    await this.runGenerator(generator, config)
  }

  /**
   * Retrive the answers
   *
   * You can't access this in `prompts` function
   */
  get answers(): { [k: string]: any } {
    if (typeof this._answers === 'symbol') {
      throw new SAOError(`You can't access \`.answers\` here`)
    }
    return this._answers
  }

  set answers(value: { [k: string]: any }) {
    this._answers = value
  }

  get data(): any {
    if (typeof this._data === 'symbol') {
      throw new SAOError(`You can't call \`.data\` here`)
    }
    return {
      ...this.answers,
      ...this._data,
    }
  }

  /**
   * Read package.json from output directory
   *
   * Returns an empty object when it doesn't exist
   */
  get pkg(): any {
    try {
      return require(path.join(this.outDir, 'package.json'))
    } catch (err) {
      return {}
    }
  }

  /**
   * Get the information of system git user
   */
  get gitUser(): GitUser {
    return getGitUser(this.opts.mock)
  }

  /**
   * The basename of output directory
   */
  get outDirName(): string {
    return path.basename(this.opts.outDir)
  }

  /**
   * The absolute path to output directory
   */
  get outDir(): string {
    return this.opts.outDir
  }

  /**
   * The npm client
   */
  get npmClient(): NPM_CLIENT {
    return getNpmClient()
  }

  /**
   * Run `git init` in output directly
   *
   * It will fail silently when `git` is not available
   */
  gitInit(): void {
    if (this.opts.mock) {
      return
    }

    const ps = spawn.sync('git', ['init'], {
      stdio: 'ignore',
      cwd: this.outDir,
    })
    if (ps.status === 0) {
      logger.success('Initialized empty Git repository')
    } else {
      logger.debug(`git init failed in ${this.outDir}`)
    }
  }

  /**
   * Run `npm install` in output directory
   */
  async npmInstall(
    opts?: Omit<InstallOptions, 'cwd' | 'registry'>
  ): Promise<{ code: number }> {
    if (this.opts.mock) {
      return { code: 0 }
    }

    return installPackages(
      Object.assign(
        {
          registry: this.opts.registry,
          cwd: this.outDir,
        },
        opts
      )
    )
  }

  /**
   * Display a success message
   */
  showProjectTips(): void {
    spinner.stop() // Stop when necessary
    logger.success(`Generated into ${colors.underline(this.outDir)}`)
  }

  /**
   * Create an SAO Error so we can pretty print the error message instead of showing full error stack
   */
  createError(message: string): SAOError {
    return new SAOError(message)
  }

  /**
   * Get file list of output directory
   */
  async getOutputFiles(): Promise<string[]> {
    const files = await glob(['**/*', '!**/node_modules/**', '!**/.git/**'], {
      cwd: this.opts.outDir,
      dot: true,
      onlyFiles: true,
    })
    return files.sort()
  }

  /**
   * Check if a file exists in output directory
   */
  async hasOutputFile(file: string): Promise<boolean> {
    return pathExists(path.join(this.opts.outDir, file))
  }

  /**
   * Read a file in output directory
   * @param file file path
   */
  async readOutputFile(file: string): Promise<string> {
    return readFile(path.join(this.opts.outDir, file), 'utf8')
  }
}

export { GeneratorConfig, handleError, store, generatorList }

export { runCLI } from './cli-engine'

import path from 'path'
import { SetRequired } from 'type-fest'
import { colors } from './utils/colors'
import resolveFrom from 'resolve-from'
import {
  loadGeneratorConfig,
  generatorHasConfig,
  GeneratorConfig,
} from './generator-config'
import { PACKAGES_CACHE_PATH } from './paths'
import { spinner } from './spinner'
import { GeneratorContext } from './generator-context'
import { installPackages } from './install-packages'
import { logger } from './logger'
import { isLocalPath } from './utils/is-local-path'
import { SAOError } from './error'
import {
  parseGenerator,
  ParsedGenerator,
  RepoGenerator,
  LocalGenerator,
  NpmGenerator,
} from './parse-generator'
import { updateCheck } from './update-check'
import { store } from './store'
import { downloadRepo } from './utils/download-repo'
import { pathExists, outputFile } from './utils/fs'

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
  /** Skip prompts and use their default values instead */
  useDefaultPromptValues?: boolean | { [k: string]: any }
}

export class SAO {
  opts: SetRequired<Options, 'outDir' | 'logLevel'>

  parsedGenerator: ParsedGenerator

  constructor(opts: Options) {
    this.opts = {
      ...opts,
      outDir: path.resolve(opts.outDir || '.'),
      logLevel: opts.logLevel || 3,
    }

    if (opts.debug) {
      this.opts.logLevel = 4
    } else if (opts.quiet) {
      this.opts.logLevel = 1
    }

    logger.setOptions({
      logLevel: this.opts.logLevel,
    })

    this.parsedGenerator = parseGenerator(this.opts.generator)
    // Sub generator can only be used in an existing
    if (this.parsedGenerator.subGenerator) {
      logger.debug(
        `Setting out directory to process.cwd() since it's a sub generator`
      )
      this.opts.outDir = process.cwd()
    }
  }

  /**
   * Run the generator.
   */
  async run(
    generator: ParsedGenerator = this.parsedGenerator,
    hasParent?: boolean
  ): Promise<void> {
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

    const loaded = await loadGeneratorConfig(generator.path)
    const config: GeneratorConfig = loaded.path
      ? loaded.data
      : require(path.join(__dirname, 'saofile.fallback.js'))

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
        return this.run(parseGenerator(generatorPath), true)
      }
      throw new SAOError(`No such sub generator in generator ${generator.path}`)
    }

    await this.runGenerator(generator, config)
  }

  async runGenerator(generator: ParsedGenerator, config: GeneratorConfig) {
    if (config.description) {
      logger.status('green', 'Generator', config.description)
    }

    const generatorContext = new GeneratorContext(this, generator)

    if (typeof config.prepare === 'function') {
      await config.prepare.call(generatorContext, generatorContext)
    }

    if (typeof this.opts.useDefaultPromptValues === 'object') {
      generatorContext._answers = this.opts.useDefaultPromptValues
    } else if (config.prompts) {
      const { runPrompts } = await import('./run-prompts')
      await runPrompts(config, generatorContext)
    } else {
      generatorContext._answers = {}
    }

    generatorContext._data = config.data
      ? config.data.call(generatorContext, generatorContext)
      : {}

    if (config.actions) {
      const { runActions } = await import('./run-actions')
      await runActions(config, generatorContext)
    }

    if (!this.opts.mock && config.completed) {
      await config.completed.call(generatorContext, generatorContext)
    }
  }
}

export { handleError } from './error'

/**
 * Ensure packages are installed in a generator
 * In most cases this is used for `repo` generators
 */
async function ensureRepo(
  generator: RepoGenerator,
  {
    update,
    clone,
    registry,
  }: { update?: boolean; clone?: boolean; registry?: string }
) {
  if (!update && (await pathExists(generator.path))) {
    return
  }

  // Download repo
  spinner.start('Downloading repo')
  try {
    await downloadRepo(generator, {
      clone, outDir: generator.path
    })
    spinner.stop()
    logger.success('Downloaded repo')
  } catch (err) {
    let message = err.message
    if (err.host && err.path) {
      message += '\n' + err.host + err.path
    }
    throw new SAOError(message)
  }
  // Only try to install dependencies for real generator
  const [hasConfig, hasPackageJson] = await Promise.all([
    generatorHasConfig(generator.path),
    pathExists(path.join(generator.path, 'package.json')),
  ])

  if (hasConfig && hasPackageJson) {
    await installPackages({
      cwd: generator.path,
      registry,
      installArgs: ['--production'],
    })
  }
}

async function ensureLocal(generator: LocalGenerator) {
  const exists = await pathExists(generator.path)

  if (!exists) {
    throw new SAOError(
      `Directory ${colors.underline(generator.path)} does not exist`
    )
  }
}

async function ensurePackage(
  generator: NpmGenerator,
  { update, registry }: { update?: boolean; registry?: string }
) {
  const installPath = path.join(PACKAGES_CACHE_PATH, generator.hash)

  if (update || !(await pathExists(generator.path))) {
    await outputFile(
      path.join(installPath, 'package.json'),
      JSON.stringify({
        private: true,
      }),
      'utf8'
    )
    logger.debug('Installing generator at', installPath)
    await installPackages({
      cwd: installPath,
      registry,
      packages: [`${generator.name}@${generator.version || 'latest'}`],
    })
  }
}

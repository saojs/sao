import path from 'path'
import { SetRequired } from 'type-fest'
import resolveFrom from 'resolve-from'
import { loadGeneratorConfig, GeneratorConfig } from './generator-config'
import { logger } from './logger'
import { isLocalPath } from './utils/is-local-path'
import { SAOError } from './error'
import { parseGenerator, ParsedGenerator } from './parse-generator'
import { updateCheck } from './update-check'
import { store } from './store'
import {
  ensureRepo,
  ensurePackage,
  ensureLocal,
} from './utils/ensure-generator'
import { GeneratorContext } from './generator-context'
import { defautSaoFile } from './default-saofile'

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

  async getGeneratorHelp(): Promise<string> {
    const { config } = await this.getGenerator()
    console.log(config)
    return ''
  }

  /**
   * Get actual generator to run and its config
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

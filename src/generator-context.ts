import path from 'path'
import { colors } from './utils/colors'
import spawn from 'cross-spawn'
import { spinner } from './spinner'
import { logger } from './logger'
import { SAOError } from './error'
import { SAO } from './'
import { ParsedGenerator } from './parse-generator'
import {
  getNpmClient,
  installPackages,
  InstallOptions,
} from './install-packages'
import { getGitUser } from './utils/git-user'

const EMPTY_ANSWERS = Symbol()
const EMPTY_DATA = Symbol()

export class GeneratorContext {
  sao: SAO
  generator: ParsedGenerator

  spinner = spinner
  colors = colors
  logger = logger

  _answers: { [k: string]: any } | Symbol = EMPTY_ANSWERS
  _data: { [k: string]: any } | Symbol = EMPTY_DATA

  constructor(sao: SAO, generator: ParsedGenerator) {
    this.sao = sao
    this.generator = generator
    this.logger = logger
  }

  get answers() {
    if (this._answers === EMPTY_ANSWERS) {
      throw new SAOError(`You can't access \`.answers\` here`)
    }
    return this._answers
  }

  get data() {
    if (this._data === EMPTY_DATA) {
      throw new SAOError(`You can't call \`.data\` here`)
    }
    return {
      ...this.answers,
      ...this._data,
    }
  }

  get pkg() {
    try {
      return require(path.join(this.outDir, 'package.json'))
    } catch (err) {
      return {}
    }
  }

  get gitUser() {
    return getGitUser(this.sao.opts.mock)
  }

  get outFolder() {
    return path.basename(this.sao.opts.outDir)
  }

  get outDir() {
    return this.sao.opts.outDir
  }

  get npmClient() {
    return getNpmClient()
  }

  gitInit() {
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

  async npmInstall(opts?: InstallOptions) {
    await installPackages(
      Object.assign(
        {
          registry: this.sao.opts.registry,
          cwd: this.outDir,
        },
        opts
      )
    )
  }

  showProjectTips() {
    spinner.stop() // Stop when necessary
    logger.success(`Generated into ${colors.underline(this.outDir)}`)
  }

  createError(message: string) {
    return new SAOError(message)
  }
}

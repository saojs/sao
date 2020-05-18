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
  NPM_CLIENT,
} from './install-packages'
import { getGitUser, GitUser } from './utils/git-user'
import { pathExists } from './utils/fs'

const EMPTY_ANSWERS = Symbol()
const EMPTY_DATA = Symbol()

export class GeneratorContext {
  sao: SAO
  generator: ParsedGenerator

  spinner = spinner
  colors = colors
  logger = logger

  pathExists = pathExists

  _answers: { [k: string]: any } | symbol = EMPTY_ANSWERS
  _data: { [k: string]: any } | symbol = EMPTY_DATA

  constructor(sao: SAO, generator: ParsedGenerator) {
    this.sao = sao
    this.generator = generator
    this.logger = logger
  }

  get answers(): any {
    if (typeof this._answers === 'symbol') {
      throw new SAOError(`You can't access \`.answers\` here`)
    }
    return this._answers
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

  get pkg(): any {
    try {
      return require(path.join(this.outDir, 'package.json'))
    } catch (err) {
      return {}
    }
  }

  get gitUser(): GitUser {
    return getGitUser(this.sao.opts.mock)
  }

  get outFolder(): string {
    return path.basename(this.sao.opts.outDir)
  }

  get outDir(): string {
    return this.sao.opts.outDir
  }

  get npmClient(): NPM_CLIENT {
    return getNpmClient()
  }

  gitInit(): void {
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

  npmInstall(opts?: InstallOptions): Promise<{ code: number }> {
    return installPackages(
      Object.assign(
        {
          registry: this.sao.opts.registry,
          cwd: this.outDir,
        },
        opts
      )
    )
  }

  showProjectTips(): void {
    spinner.stop() // Stop when necessary
    logger.success(`Generated into ${colors.underline(this.outDir)}`)
  }

  createError(message: string): SAOError {
    return new SAOError(message)
  }
}

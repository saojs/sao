import path from 'path'
import sum from 'hash-sum'
import parsePackageName from 'parse-package-name'
import { REPOS_CACHE_PATH, PACKAGES_CACHE_PATH } from './paths'
import { store } from './store'
import { SAOError } from './error'
import { isLocalPath, removeLocalPathPrefix } from './utils/is-local-path'
import { escapeDots } from './utils/common'

export interface LocalGenerator {
  type: 'local'
  path: string
  hash: string
  subGenerator?: string
}

export interface NpmGenerator {
  type: 'npm'
  name: string
  version: string
  slug: string
  subGenerator?: string
  hash: string
  path: string
}

export interface RepoGenerator {
  type: 'repo'
  prefix: GeneratorPrefix
  user: string
  repo: string
  version: string
  subGenerator?: string
  hash: string
  path: string
}

export type ParsedGenerator = LocalGenerator | NpmGenerator | RepoGenerator

export type GeneratorPrefix = 'npm' | 'github' | 'gitlab' | 'bitbucket'

export function parseGenerator(generator: string): ParsedGenerator {
  if (generator.startsWith('alias:')) {
    const alias = generator.slice(6)
    const url = store.get(`alias.${escapeDots(alias)}`) as string | undefined
    if (!url) {
      throw new SAOError(`Cannot find alias '${alias}'`)
    }
    return parseGenerator(url)
  }

  // Generator is a local path
  if (isLocalPath(generator)) {
    let subGenerator: string | undefined
    if (removeLocalPathPrefix(generator).includes(':')) {
      subGenerator = generator.slice(generator.lastIndexOf(':') + 1)
      generator = generator.slice(0, generator.lastIndexOf(':'))
    }
    const absolutePath = path.resolve(generator)
    return {
      type: 'local',
      path: absolutePath,
      hash: sum(absolutePath),
      subGenerator,
    }
  }

  const GENERATOR_PREFIX_RE = /^(npm|github|bitbucket|gitlab):/

  // Infer prefix for naked generate name (without prefix)
  if (!GENERATOR_PREFIX_RE.test(generator)) {
    if (generator.startsWith('@')) {
      generator = `npm:${generator.replace(/\/(sao-)?/, '/sao-')}`
    } else if (generator.includes('/')) {
      generator = `github:${generator}`
    } else {
      generator = `npm:${generator.replace(/^(sao-)?/, 'sao-')}`
    }
  }

  // Get generator type, e.g. `npm` or `github`
  let prefix: GeneratorPrefix = 'npm'
  let m: RegExpExecArray | null = null
  if ((m = GENERATOR_PREFIX_RE.exec(generator))) {
    prefix = m[1] as GeneratorPrefix
    generator = generator.replace(GENERATOR_PREFIX_RE, '')
  }

  // Generator is a npm package
  if (prefix === 'npm') {
    const hasSubGenerator = generator.indexOf(':') !== -1
    const slug = generator.slice(
      0,
      hasSubGenerator ? generator.indexOf(':') : generator.length
    )
    const parsed = parsePackageName(slug)
    const hash = sum(`npm:${slug}`)
    return {
      type: 'npm',
      name: parsed.name,
      version: parsed.version || 'latest',
      slug,
      subGenerator: hasSubGenerator
        ? generator.slice(generator.indexOf(':') + 1)
        : undefined,
      hash,
      path: path.join(PACKAGES_CACHE_PATH, hash, 'node_modules', parsed.name),
    }
  }

  // Generator is a repo
  const [, user, repo, version = 'master', subGenerator] =
    /([^/]+)\/([^#:]+)(?:#(.+))?(?::(.+))?$/.exec(generator) || []
  const hash = sum({
    type: 'repo',
    prefix,
    user,
    repo,
    version,
    subGenerator,
  })
  return {
    type: 'repo',
    prefix,
    user,
    repo,
    version,
    subGenerator,
    hash,
    path: path.join(REPOS_CACHE_PATH, hash),
  }
}

const path = require('path')
const sum = require('hash-sum')
const paths = require('./paths')
const store = require('./store')
const SAOError = require('./SAOError')
const isLocalPath = require('./utils/isLocalPath')
const { escapeDots } = require('./utils/common')

/**
 *
 * @param {string} generator
 * @return {Object}
 */
module.exports = generator => {
  if (isLocalPath(generator)) {
    let subGenerator
    if (isLocalPath.removePrefix(generator).includes(':')) {
      subGenerator = generator.slice(generator.lastIndexOf(':') + 1)
      generator = generator.slice(0, generator.lastIndexOf(':'))
    }
    const absolutePath = path.resolve(generator)
    return {
      type: 'local',
      path: absolutePath,
      hash: sum(absolutePath),
      subGenerator
    }
  }

  const SPECIAL_PREFIX_RE = /^(npm|github|bitbucket|gitlab|alias):/

  if (!SPECIAL_PREFIX_RE.test(generator) && !generator.includes('/')) {
    generator = `npm:sao-${generator}`
  }

  /** @type {string|null} */
  let type = null
  if (SPECIAL_PREFIX_RE.test(generator)) {
    type = SPECIAL_PREFIX_RE.exec(generator)[1]
    generator = generator.replace(SPECIAL_PREFIX_RE, '')
  }

  if (type === 'npm') {
    const hasSubGenerator = generator.indexOf(':') !== -1
    const slug = generator.slice(
      0,
      hasSubGenerator ? generator.indexOf(':') : generator.length
    )
    const parsed = require('parse-package-name')(slug)
    const hash = sum(`npm:${slug}`)
    return {
      type: 'npm',
      name: parsed.name,
      version: parsed.version,
      slug,
      subGenerator:
        hasSubGenerator && generator.slice(generator.indexOf(':') + 1),
      hash,
      path: path.join(paths.packagePath, hash, 'node_modules', parsed.name)
    }
  }

  if (type === 'alias') {
    const hasSubGenerator = generator.indexOf(':') !== -1
    const alias = generator.slice(
      0,
      hasSubGenerator ? generator.indexOf(':') : generator.length
    )
    const url = store.get(`alias.${escapeDots(alias)}`)
    if (!url) {
      throw new SAOError(`Cannot find alias '${alias}'`)
    }
    if (isLocalPath(url)) {
      return {
        type: 'local',
        path: url,
        subGenerator:
          hasSubGenerator && generator.slice(generator.indexOf(':') + 1),
        hash: sum(url)
      }
    }
    const slug = `direct:${url}`
    const hash = sum(`repo:${slug}`)
    return {
      type: 'repo',
      slug,
      subGenerator:
        hasSubGenerator && generator.slice(generator.indexOf(':') + 1),
      hash,
      path: path.join(paths.repoPath, hash)
    }
  }

  const [
    ,
    user,
    repo,
    version,
    subGenerator
  ] = /([^/]+)\/([^#:]+)(?:#(.+))?(?::(.+))?$/.exec(generator)
  const slug = `${type ? `${type}:` : ''}${user}/${repo}${
    version ? `#${version}` : ''
  }`
  const hash = sum(`repo:${slug}`)
  return {
    type: 'repo',
    slug,
    subGenerator,
    hash,
    path: path.join(paths.repoPath, hash)
  }
}

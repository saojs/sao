const path = require('path')

const WIN_PREFIX_RE = /^[a-zA-Z]:/

/**
 * Parse generator name
 * @param {string} name
 */
module.exports = name => {
  if (path.isAbsolute(name) || name[0] === '.') {
    const isWinAbsolute = WIN_PREFIX_RE.test(name)
    let generator
    if (isWinAbsolute) {
      const firstColonIndex = name.replace(WIN_PREFIX_RE, '').indexOf(':')
      if (firstColonIndex > -1) {
        generator = name.slice(firstColonIndex + 1).split(':')
        name = name.slice(0, firstColonIndex)
      }
    } else {
      const firstColonIndex = name.indexOf(':')
      if (firstColonIndex > -1) {
        generator = name.slice(firstColonIndex + 1).split(':')
        name = name.slice(0, firstColonIndex)
      }
    }
    return {
      type: 'local',
      path: name,
      name,
      generator
    }
  }

  if (!name.startsWith('npm:') && /^[\w\-\:\@\^]+$/.test(name)) {
    name = `npm:sao-${name}`
  }

  if (name.startsWith('npm:')) {
    name = name.slice(4)
    const firstColonIndex = name.indexOf(':')
    let generator
    if (firstColonIndex > -1) {
      generator = name.slice(firstColonIndex + 1).split(':')
      name = name.slice(0, firstColonIndex)
    }
    return {
      type: 'npm',
      generator,
      module: name,
      name
    }
  }

  if (/.+\/.+/.test(name)) {
    const [, user, repo, version, generator] = /([^/]+)\/([^#:]+)(?:#(.+))?(?:\:(.+))?$/.exec(name)

    return {
      type: 'git',
      user,
      repo,
      version,
      name: `${user}/${repo}`,
      generator: generator && generator.split(':')
    }
  }
}

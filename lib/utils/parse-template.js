const path = require('path')

const ensurePackageName = name => name.replace(/^(template-)?/, 'template-')

module.exports = template => {
  if (/^[./]|(^[a-zA-Z]:)/.test(template)) {
    return {
      type: 'local',
      path: path.resolve(template)
    }
  }

  // npm package
  if (!/\//.test(template)) {
    const [, name, version] = /([^@]+)(?:@(.+))?$/.exec(template)
    return {
      type: 'npm',
      name: ensurePackageName(name),
      version
    }
  }

  // npm scoped package
  if (template.startsWith('@')) {
    const [, user, name, version] = /^@([^/]+)\/([^@]+)(?:@(.+))?$/.exec(
      template
    )
    return {
      type: 'npm',
      scoped: true,
      user,
      name: ensurePackageName(name),
      version
    }
  }

  // git repo
  if (/.+\/.+/.test(template)) {
    const [, user, name, version] = /([^/]+)\/([^#]+)(?:#(.+))?$/.exec(template)

    return {
      type: 'repo',
      user,
      name,
      version
    }
  }
}

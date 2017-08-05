const path = require('path')

const ensurePackageName = name => name.replace(/^(template-)?/, 'template-')

function parse(template, templatePrefix = true) {
  if (/^[./]|(^[a-zA-Z]:)/.test(template)) {
    return {
      type: 'local',
      path: path.resolve(template)
    }
  }

  // Explict npm name
  if (template.startsWith('npm:')) {
    return parse(template.replace(/^npm:/, ''), false)
  }

  // npm package
  if (!/\//.test(template)) {
    const [, name, version] = /([^@]+)(?:@(.+))?$/.exec(template)
    return {
      type: 'npm',
      name: templatePrefix ? ensurePackageName(name) : name,
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
      name: templatePrefix ? ensurePackageName(name) : name,
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

module.exports = parse

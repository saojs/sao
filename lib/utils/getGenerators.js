const { join } = require('path')
const { readFile, existsSync } = require('fs-extra')
const tildify = require('tildify')
const store = require('../store')

async function getGenerators() {
  const packages = []
  const repos = []
  const locals = []

  const { generators, alias } = store.store

  await Promise.all([
    ...Object.keys(generators).map(async hash => {
      const { type, slug, name, path } = generators[hash]
      let { version } = await getPkg(path)
      if (version) {
        version = normalizeVersion(version)
      }
      if (type === 'npm') {
        packages.push({ name, version })
      } else if (type === 'repo') {
        repos.push({ name: slug, version })
      } else if (type === 'local') {
        locals.push({ path: tildify(path), alias: getAlias(alias, path) })
      }
    })
  ])

  return { packages, repos, locals }
}

async function getPkg(dir) {
  const pkg = join(dir, 'package.json')
  if (!existsSync(pkg)) {
    return {}
  }
  return JSON.parse(await readFile(pkg, 'utf8'))
}

function normalizeVersion(version) {
  return version.replace(/^(\^|~)/, '')
}

function getAlias(alias = {}, path) {
  return Object.keys(alias).find(k => alias[k] === path)
}

module.exports = getGenerators

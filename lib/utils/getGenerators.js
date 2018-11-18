const { join } = require('path')
const { readFile, readdirSync, existsSync } = require('fs-extra')
const { repoPath, packagePath } = require('../paths')

async function getGenerators() {
  const packages = []
  const repos = []

  await Promise.all([
    ...(getFiles(packagePath).map(async folder => {
      const dependencies = (await getPkg(folder)).dependencies || {}
      delete dependencies.add
      const keys = Object.keys(dependencies)
      const name = keys[0]
      const version = dependencies[name]
      if (name) {
        packages.push({ name, version: normalizeVersion(version) })
      }
    })),
    ...(getFiles(repoPath).map(async folder => {
      const { name, version } = (await getPkg(folder))
      if (name) {
        repos.push({ name, version: normalizeVersion(version) })
      }
    }))
  ])

  return { packages, repos }
}

function getFiles(dir) {
  if (!existsSync(dir)) {
    return []
  }
  const items = readdirSync(dir)
  return items.map(i => join(dir, i))
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

module.exports = getGenerators


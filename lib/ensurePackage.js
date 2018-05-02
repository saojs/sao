const os = require('os')
const path = require('path')
const parse = require('parse-package-name')
const installPackages = require('install-packages')
const { fs } = require('majo')
const promisify = require('./utils/promisify')

const resolve = promisify(require('resolve'))

let ensured
const packageDir = path.join(os.homedir(), '.sao', 'packages')

async function resolvePath(_name, {
  forceInstall = false,
  baseDir = packageDir,
  packageManager
} = {}) {
  const { name, version } = parse(_name)

  if (!ensured && !(await fs.exists(packageDir))) {
    await fs.ensureDir(packageDir)
    await fs.writeFile(path.join(packageDir, 'package.json'), '{}', 'utf8')
    ensured = true
  }

  const install = async() => {
    const spinner = require('./spinner').start(`Installing ${name}...`)
    try {
      await installPackages({
        packages: [`${name}${version ? `@${version}` : ''}`],
        cwd: baseDir,
        installPeers: false,
        packageManager,
        logTitle: false
      })
      spinner.stop()
    } catch (err) {
      spinner.stop()
      throw err
    }
    return resolvePath(_name, baseDir)
  }

  if (forceInstall) {
    return install()
  }

  try {
    const p = await resolve(`${name}/package.json`, { basedir: baseDir })
    return path.dirname(p)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return install()
    } else {
      throw err
    }
  }
}

module.exports = resolvePath

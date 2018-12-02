const spawn = require('cross-spawn')
const logUpdate = require('log-update')
const spinner = require('./spinner')
const logger = require('./logger')
const SAOError = require('./SAOError')

let cachedNpmClient = null

function setNpmClient(npmClient) {
  cachedNpmClient = npmClient
}

function getNpmClient() {
  if (cachedNpmClient) {
    return cachedNpmClient
  }

  if (spawn.sync('yarn', ['--version']).status === 0) {
    cachedNpmClient = 'yarn'
  } else {
    cachedNpmClient = 'npm'
  }

  return cachedNpmClient
}

module.exports = async ({
  cwd,
  npmClient,
  installArgs,
  packages,
  saveDev,
  registry
}) => {
  npmClient = npmClient || getNpmClient()
  const packageName = packages ? packages.join(', ') : 'packages'

  return new Promise((resolve, reject) => {
    // `npm/pnpm/yarn add <packages>`
    // `npm/pnpm/yarn install`
    const args = [packages ? 'add' : 'install'].concat(packages ? packages : [])
    if (saveDev) {
      args.push(npmClient === 'npm' ? '-D' : '--dev')
    }
    if (registry) {
      args.push('--registry', registry)
    }

    if (installArgs) {
      args.push(...installArgs)
    }

    logger.debug(npmClient, args.join(' '))
    logger.debug('install directory', cwd)
    spinner.start(`Installing ${packageName} with ${npmClient}`)
    const ps = spawn(npmClient, args, {
      stdio: [0, 'pipe', 'pipe'],
      cwd,
      env: Object.assign(
        {
          FORCE_COLOR: true,
          /* eslint-disable camelcase */
          npm_config_color: 'always',
          npm_config_progress: true
          /* eslint-enable camelcase */
        },
        process.env
      )
    })

    let stdoutLogs = ''
    let stderrLogs = ''

    ps.stdout &&
      ps.stdout.setEncoding('utf8').on('data', data => {
        if (npmClient === 'pnpm') {
          stdoutLogs = data
        } else {
          stdoutLogs += data
        }
        spinner.stop()
        logUpdate(stdoutLogs)
        spinner.start()
      })

    ps.stderr &&
      ps.stderr.setEncoding('utf8').on('data', data => {
        if (npmClient === 'pnpm') {
          stderrLogs = data
        } else {
          stderrLogs += data
        }
        spinner.stop()
        logUpdate.clear()
        logUpdate.stderr(stderrLogs)
        logUpdate(stdoutLogs)
        spinner.start()
      })

    ps.on('close', code => {
      spinner.stop()
      // Clear output when succeeded
      if (code === 0) {
        logUpdate.clear()
        logUpdate.stderr.clear()
        logger.success(`Installed ${packageName}`)
      } else {
        throw new SAOError(`Failed to install ${packageName} in ${cwd}`)
      }
      resolve({ code, npmClient })
    })

    ps.on('error', reject)
  })
}

module.exports.getNpmClient = getNpmClient
module.exports.setNpmClient = setNpmClient
